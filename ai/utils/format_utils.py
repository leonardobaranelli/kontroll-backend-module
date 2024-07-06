import json
from models.model import model, tokenizer

# Transforms a key-value pair using the model
def transform_key_value(key, value):
    # Prepare the input text for the model
    input_text = f"translate {key} : {value} to target"
    try:
        # Tokenize the input text
        input_ids = tokenizer.encode(input_text, return_tensors="pt")
    except Exception as e:
        # Return the original key-value pair if tokenization fails
        return {key: value}
    
    try:
        # Generate output using the model
        outputs = model.generate(input_ids, max_length=50, num_beams=2, early_stopping=True)
        # Decode the output into text
        output_text = tokenizer.decode(outputs[0], skip_special_tokens=True)
    except Exception as e:
        # Return the original key-value pair if generation fails
        return {key: value}
    
    try:
        # Format the output text into JSON
        output_text = '{"' + output_text.replace(' : ', '": "').replace('_', ' ') + '"}'
        transformed = json.loads(output_text)
        return transformed
    except json.JSONDecodeError:
        # Return the original key-value pair if JSON decoding fails
        return {key: value}
    except Exception as e:
        # Return the original key-value pair if any other exception occurs
        return {key: value}

# Formats product data by transforming each key-value pair
def format_shipment(data):
    formatted_data = {}
    for key, value in data.items():
        # Transform each key-value pair and update the formatted data
        formatted_pair = transform_key_value(key, value)
        formatted_data.update(formatted_pair)
    return formatted_data
