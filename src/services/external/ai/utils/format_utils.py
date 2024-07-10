import json
from transformers import BartForConditionalGeneration, BartTokenizer
from ..config.model_config import MODEL_NAME
from ..config.shipment_structure import SHIPMENT_STRUCTURE

# Load the BART model and tokenizer
model = BartForConditionalGeneration.from_pretrained(MODEL_NAME)
tokenizer = BartTokenizer.from_pretrained(MODEL_NAME)

def transform_key_value(target_key, input_value):
    input_text = f"translate {input_value} to {target_key}"
    print(f"DEBUG: Transforming {input_value} to {target_key} with input text: {input_text}")
    try:
        input_ids = tokenizer.encode(input_text, return_tensors="pt")
        print(f"DEBUG: Input IDs: {input_ids}")
        outputs = model.generate(input_ids, max_length=50, num_beams=2, early_stopping=True)
        output_text = tokenizer.decode(outputs[0], skip_special_tokens=True)
        print(f"DEBUG: Model output for {input_text}: {output_text}")
        
        # Check if the output is the same as the input (model didn't translate)
        if output_text.strip() == input_text.strip():
            # If so, return null
            print(f"DEBUG: Model did not translate. Returning null.")
            return {target_key.split('.')[-1]: None}
        
        try:
            transformed = json.loads(output_text)
            # Flatten the nested structure
            while isinstance(transformed, dict) and len(transformed) == 1:
                transformed = next(iter(transformed.values()))
            print(f"DEBUG: Transformed JSON output: {transformed}")
            return {target_key.split('.')[-1]: transformed}
        except json.JSONDecodeError:
            # If the output is not valid JSON, return null
            print(f"DEBUG: Output is not valid JSON. Returning null.")
            return {target_key.split('.')[-1]: None}
    except Exception as e:
        print(f"Error in transform_key_value: {e}")
        return {target_key.split('.')[-1]: None}
    
# Formats product data by transforming each key-value pair
def format_shipment(data):
    return format_nested(SHIPMENT_STRUCTURE, data)

def format_nested(structure, data, parent_key=''):
    result = {}
    for key, value in structure.items():
        full_key = f"{parent_key}.{key}" if parent_key else key
        print(f"DEBUG: Processing key: {full_key}")
        if isinstance(value, dict):
            result[key] = format_nested(value, data, full_key)
        elif isinstance(value, list):
            result[key] = [format_nested(value[0], data, f"{full_key}[]")]
        else:
            transformed = None
            for data_key, data_value in data.items():
                print(f"DEBUG: Checking data key: {data_key} with value: {data_value}")
                if isinstance(data_value, dict):
                    nested_result = format_nested({key: value}, data_value, data_key)
                    if nested_result:
                        transformed = nested_result[key]
                        break
                else:
                    transformed_result = transform_key_value(full_key, f"{data_key} : {data_value}")
                    if transformed_result:
                        transformed = transformed_result.get(full_key.split('.')[-1])
                        break
            result[key] = transformed
            print(f"DEBUG: Transformed result for {full_key}: {transformed}")
    return result

