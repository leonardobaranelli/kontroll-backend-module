from .classifier import classify_batch
from .preprocessor import preprocess_text
from ..config.model_config import FIELD_SYNONYMS
from ..utils.logging_utils import get_logger

logger = get_logger(__name__)

def classify_and_map(field_name, field_value, target):
    labels = list(FIELD_SYNONYMS.keys())
    
    preprocessed_text = preprocess_text(f"{field_name}: {field_value}")
    
    texts_to_classify = [preprocessed_text] + [f"{syn}: {field_value}" for syn in FIELD_SYNONYMS[field_name]]
    
    classifications = classify_batch(texts_to_classify, labels)
    
    best_classification = max(classifications, key=lambda x: x['scores'][0])

    best_label = best_classification['labels'][0]
    confidence = best_classification['scores'][0]
    
    if confidence > 0.1:
        logger.info(f"Mapped {field_name}: {field_value} to {best_label} with confidence {confidence}")
        update_target(target, best_label, field_value)
    else:
        logger.debug(f"Discarded {field_name}: {field_value} due to low confidence")

def update_target(target, label, value):
    keys = label.split('.')
    current = target
    for key in keys[:-1]:
        if key not in current:
            current[key] = {}
        current = current[key]
    final_key = keys[-1]
    if final_key == '*body':
        current[keys[-2]] = value
    elif final_key == '@uom':
        if not isinstance(current[keys[-2]], dict):
            current[keys[-2]] = {'*body': current[keys[-2]], '@uom': value}
        else:
            current[keys[-2]]['@uom'] = value
    else:
        current[final_key] = value