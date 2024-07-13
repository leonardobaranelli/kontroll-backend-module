import json
from ..utils.format_utils import format_shipment
from ..utils.test_utils import generate_random_test_object, save_unformatted_keys_to_file, sort_unformatted_keys
from ..config.file_paths import TRAINING_FILES

def run_test():
    # Load training data to extract keys and values
    print("Loading training examples...")
    with open(TRAINING_FILES[0], "r", encoding="utf-8") as file:
        training_examples = json.load(file)

    # Ensure training_examples is a list of dictionaries
    if not isinstance(training_examples, list) or not all(isinstance(ex, dict) for ex in training_examples):
        raise ValueError("training_examples must be a list of dictionaries")

    # Target keys with example values
    target_keys = {
        "HousebillNumber": "GMDBD8E9CCE94842E495B7",
        "Origin.LocationCode": "US",
        "Origin.LocationName": "AMERICAN FORK",
        "Destination.LocationCode": "GB",
        "Destination.LocationName": "SHEFFIELD",
        "Destination.CountryCode": "GB",
        "DateAndTimes.ShipmentDate": "2023-01-29T16:02:00",
        "ProductType": "ecommerce",
        "TotalWeight.*body": 0.831,
        "TotalWeight.@uom": "LB",
        "Timestamp[].TimestampCode": "transit",
        "Timestamp[].TimestampDescription": "ARRIVED AT CUSTOMS",
        "Timestamp[].TimestampDateTime": "2023-01-29T16:02:00",
        "Timestamp[].TimestampLocation": "HEATHROW, GB"
    }

    # Generate a random test object ensuring target keys are present
    random_test_object = generate_random_test_object(target_keys, training_examples)
    print('Random Test Object:', random_test_object)

    # Format the object using the trained model
    formatted_data = format_shipment(random_test_object)

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