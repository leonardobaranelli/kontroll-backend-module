import json
from ..utils.format_utils import format_shipment
from ..utils.test_utils import save_unformatted_keys_to_file, sort_unformatted_keys
from ..config.file_paths import TRAINING_FILE, UNFORMATTED_KEYS_FILE
from ..config.shipment_structure import SHIPMENT_STRUCTURE

def run_test():
    # Load training data to extract keys and values
    print("Loading training examples...")
    with open(TRAINING_FILE, "r", encoding="utf-8") as file:
        training_examples = json.load(file)

    # Ensure training_examples is a list of dictionaries
    if not isinstance(training_examples, list) or not all(isinstance(ex, dict) for ex in training_examples):
        raise ValueError("training_examples must be a list of dictionaries")

    # Use a fixed test object
    fixed_test_object = {
        "id": "ABC123XYZ456",
        "origin": {
            "address": {
                "countryCode": "US",
                "addressLocality": "NEW YORK"
            }
        },
        "destination": {
            "address": {
                "countryCode": "GB",
                "addressLocality": "LONDON"
            }
        },
        "status": {
            "timestamp": "2023-06-01T08:45:00",
            "statusCode": "delivered",
            "status": "OUT FOR DELIVERY",
            "location": {
                "address": {
                    "addressLocality": "HEATHROW, GB"
                }
            }
        },
        "service": "express",
        "details": {
            "weight": {
                "value": 2.5,
                "unitText": "KG"
            }
        }
    }

    print('Fixed Test Object:', json.dumps(fixed_test_object, indent=2))

    # Format the fixed test object using the trained model
    formatted_data = format_shipment(fixed_test_object)

    print('\nFormatted Data:')
    print(json.dumps(formatted_data, indent=2))

    # Define the expected structure
    expected_structure = SHIPMENT_STRUCTURE

    # Validate the formatted data against the expected structure
    def validate_structure(data, structure, path=""):
        missing_keys = []
        for key, expected_type in structure.items():
            current_path = f"{path}.{key}" if path else key
            if key not in data:
                missing_keys.append(current_path)
            elif isinstance(expected_type, dict):
                missing_keys.extend(validate_structure(data[key], expected_type, current_path))
            elif isinstance(expected_type, list):
                if not isinstance(data[key], list) or not data[key]:
                    missing_keys.append(current_path)
                else:
                    missing_keys.extend(validate_structure(data[key][0], expected_type[0], f"{current_path}[]"))
            elif not isinstance(data[key], expected_type):
                missing_keys.append(current_path)
        return missing_keys

    missing_keys = validate_structure(formatted_data, expected_structure)

    if missing_keys:
        print('\nKeys that could not be formatted or are missing:', missing_keys)
        save_unformatted_keys_to_file(missing_keys)
    else:
        print('\nAll keys were formatted correctly and match the expected structure.')

if __name__ == "__main__":
    run_test()
    sort_unformatted_keys()
