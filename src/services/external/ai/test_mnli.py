import json
import logging
import os
import unicodedata
import re
from pathlib import Path
from transformers import pipeline
import torch
from .config.model_config import MODEL_NAME
from .config.shipment_structure import SHIPMENT_STRUCTURE
from .config.file_paths import DHL_SHIPPING_EXAMPLES_FILE, MODEL_PATH, FIELD_SYNONYMS_FILE

# Configure logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Get the absolute path of the current directory
current_dir = Path(__file__).resolve().parent

# Initialize the zero-shot classification pipeline with the Comprehend IT model
classifier = pipeline("zero-shot-classification", 
                      model="knowledgator/comprehend_it-base", 
                      device='cuda' if torch.cuda.is_available() else 'cpu')

def initialize_keys(structure, target):
    if isinstance(structure, dict):
        for key, value in structure.items():
            target[key] = {}
            initialize_keys(value, target[key])

def preprocess_text(text):
    text = text.lower()
    text = re.sub(r'\s+', ' ', text).strip()
    return text

# Load field synonyms once at the module level
with open(FIELD_SYNONYMS_FILE, 'r') as f:
    field_synonyms = json.load(f)

def find_synonyms(field_name):
    return [key for key, syn_list in field_synonyms.items() if field_name in syn_list]

def classify_batch(texts, labels, batch_size=32):
    results = []
    for i in range(0, len(texts), batch_size):
        batch = texts[i:i+batch_size]
        batch_results = classifier(batch, labels, multi_label=False)
        results.extend(batch_results)
    return results

def classify_and_map(field_name, field_value, target, mapped_keys):
    labels = list(field_synonyms.keys())
    
    preprocessed_text = preprocess_text(f"{field_name}: {field_value}")
    logger.debug(f"Classifying: '{preprocessed_text}'")
    
    texts_to_classify = [preprocessed_text] + [f"{syn}: {field_value}" for syn in field_synonyms.get(field_name, [])]
    
    classifications = classify_batch(texts_to_classify, labels)
    
    best_classification = max(classifications, key=lambda x: x['scores'][0])
    best_label = best_classification['labels'][0]
    confidence = best_classification['scores'][0]
    
    logger.debug(f"Best label: {best_label}, Confidence: {confidence}")
    
    if confidence > 0.1:  # Lowered threshold for testing
        keys = best_label.split('.')
        current = target
        for key in keys[:-1]:
            if key not in current:
                current[key] = {}
            current = current[key]
        final_key = keys[-1]
        if final_key not in mapped_keys or mapped_keys[final_key] < confidence:
            if final_key == '*body':
                current[keys[-2]] = field_value
            elif final_key == '@uom':
                if not isinstance(current[keys[-2]], dict):
                    current[keys[-2]] = {'*body': current[keys[-2]], '@uom': field_value}
                else:
                    current[keys[-2]]['@uom'] = field_value
            else:
                current[final_key] = field_value
            mapped_keys[final_key] = confidence
            logger.info("-------------------------------------------------------------------------------------------------------")
            logger.info(f"Mapped {field_name}: {field_value} to {best_label}")
            logger.info("-------------------------------------------------------------------------------------------------------")
        else:
            logger.debug(f"Skipped mapping {field_name}: {field_value} to {best_label} due to lower confidence")
    else:
        logger.debug(f"Discarded {field_name}: {field_value} due to low confidence")

    synonyms = find_synonyms(field_name)
    for synonym in synonyms:
        logger.debug(f"Trying synonym for {field_name}: {synonym}")
        classify_and_map(synonym, field_value, target, mapped_keys)

def process_nested_fields(obj, parent_key='', target=None, mapped_keys=None):
    if target is None:
        target = {}
    if mapped_keys is None:
        mapped_keys = {}
    try:
        if isinstance(obj, dict):
            for key, value in obj.items():
                new_key = f"{parent_key}.{key}" if parent_key else key
                process_nested_fields(value, new_key, target, mapped_keys)
        elif isinstance(obj, list):
            for i, item in enumerate(obj):
                new_key = f"{parent_key}[{i}]"
                process_nested_fields(item, new_key, target, mapped_keys)
        else:
            logger.info(f"Processing field: {parent_key} with value: {obj}")
            classify_and_map(parent_key, obj, target, mapped_keys)
    except Exception as e:
        logger.error(f"Error processing field {parent_key}: {str(e)}")
    return target

def map_to_shipment_structure(input_json):
    try:
        shipment = json.loads(input_json)['shipments'][0]
    except json.JSONDecodeError:
        logger.error("Invalid JSON input")
        return None
    except KeyError:
        logger.error("JSON does not contain 'shipments' key")
        return None
    
    logger.info(f"Processing shipment: {json.dumps(shipment, indent=2)}")
    
    result = {}
    initialize_keys(SHIPMENT_STRUCTURE, result)
    
    result = process_nested_fields(shipment, target=result)
    return result

if __name__ == "__main__":
    dhl_shipping_examples_file = DHL_SHIPPING_EXAMPLES_FILE
    with open(dhl_shipping_examples_file, 'r') as f:
        json_data = f.read()
    
    logger.info("Starting shipment structure mapping")
    result = map_to_shipment_structure(json_data)
    if result:
        logger.info("Mapping completed")
        print(json.dumps(result, indent=2))
    else:
        logger.error("Mapping failed")