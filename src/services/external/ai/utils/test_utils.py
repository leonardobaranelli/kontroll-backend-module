import random
from collections import defaultdict
from config import UNFORMATTED_KEYS_FILE

# Saves the unformatted keys to a file, updating the count of each key.
def save_unformatted_keys_to_file(unformatted_keys, file_path=UNFORMATTED_KEYS_FILE):
    counter = defaultdict(int)
    try:
        # Open the file and read keys and their counts
        with open(file_path, "r") as file:
            for line in file:
                key, count = line.strip().split(": ")
                counter[key] = int(count)
    except FileNotFoundError:
        pass
    
    # Update the count of each unformatted key
    for key in unformatted_keys:
        counter[key] += 1

    # Write the updated keys and counts to the file
    with open(file_path, "w") as file:
        for key, count in counter.items():
            file.write(f"{key}: {count}\n")

# Sorts the unformatted keys in the file by their count in descending order.
def sort_unformatted_keys(file_path=UNFORMATTED_KEYS_FILE):
    counter = defaultdict(int)
    
    # Read keys and their counts from the file
    with open(file_path, "r") as file:
        for line in file:
            key, count = line.strip().split(": ")
            counter[key] = int(count)
    
    # Sort keys by their count in descending order
    sorted_keys = sorted(counter.items(), key=lambda item: item[1], reverse=True)
    
    # Write the sorted keys to the file
    with open(file_path, "w") as file:
        for key, count in sorted_keys:
            file.write(f"{key}: {count}\n")

# Gets a random key-value pair for a target key from training examples.
def get_random_key_value_for_target(target_key, training_examples):
    # Filter examples containing the target key in the output
    possible_examples = [ex for ex in training_examples if target_key in ex["output"].keys()]
    if not possible_examples:
        return None, None
    # Select a random example from the possible ones
    example = random.choice(possible_examples)
    input_key = list(example["input"].keys())[0]
    input_value = example["input"][input_key]
    return input_key, input_value

# Generates a random test object based on target keys and training examples.
def generate_random_test_object(target_keys, training_examples):
    test_object = {}
    # For each target key, get a random key-value pair from training examples
    for target_key in target_keys.keys():
        origin_key, value = get_random_key_value_for_target(target_key, training_examples)
        if origin_key and value:
            test_object[origin_key] = value
    # Randomly shuffle keys and values in the test object
    shuffled_test_object = dict(random.sample(list(test_object.items()), len(test_object)))
    return shuffled_test_object
