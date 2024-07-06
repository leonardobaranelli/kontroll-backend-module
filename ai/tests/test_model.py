import json
from utils.format_utils import format_product
from utils.test_utils import generate_random_test_object, save_unformatted_keys_to_file, sort_unformatted_keys

def run_test():
    # Load training data to extract keys and values
    print("Loading training examples...")
    with open("data/training_examples.json", "r") as file:
        training_examples = json.load(file)

    # Target keys with example values
    target_keys = {
        "name": "Product-50",
        "originCountry": "Country-50",
        "finalCountry": "Destination-50",
        "departureDate": "21/10/24",
        "arrivalDate": "25/12/24",
        "status": "Processing",
        "provider": "Provider-50",
        "courier": "DHL"
    }

    # Generate a random test object ensuring target keys are present
    random_test_object = generate_random_test_object(target_keys, training_examples)
    print('Random Test Object:', random_test_object)

    # Format the object using the trained model
    formatted_data = format_product(random_test_object)

    # Ensure all target keys are present
    final_data = {target_key: formatted_data.get(target_key, None) for target_key in target_keys}
    print('Final Formatted Data:', final_data)

    # Identify origin_keys that couldn't be formatted correctly
    unformatted_keys = []
    for key, value in random_test_object.items():
        if key in target_keys and (formatted_data.get(key) == value or formatted_data.get(key) is None):
            continue  # Ignore desired keys already present or have desired values
        target_key = next((t_key for t_key, t_value in target_keys.items() if formatted_data.get(t_key) == value), None)
        if target_key is None or final_data.get(target_key) is None:
            unformatted_keys.append(key)

    if unformatted_keys:
        print('\nKeys that could not be formatted:', unformatted_keys)
        save_unformatted_keys_to_file(unformatted_keys)
    else:
        print('\nAll keys were formatted correctly.')

if __name__ == "__main__":
    run_test()
    sort_unformatted_keys()
