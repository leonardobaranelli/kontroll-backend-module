import json
import logging
from typing import List, Dict, Tuple
from transformers import T5Tokenizer
from torch.utils.data import DataLoader, TensorDataset
from utils.file_utils import backup_and_update_file, compare_json_files, reset_file

# Loads training and validation data from JSON files
def load_data(training_files: List[str], validation_file: str) -> Tuple[List[Dict], List[Dict]]:
    training_data = []
    # Iterate over each training file and load the data
    for training_file in training_files:
        with open(training_file, 'r') as f:
            training_data.extend(json.load(f))
    
    # Load validation data
    with open(validation_file, 'r') as f:
        validation_data = json.load(f)
    
    return training_data, validation_data

# Loads unformatted keys from a text file
def load_unformatted_keys(file_path: str) -> Dict[str, int]:
    new_keys = {}
    try:
        # Open the file and read line by line
        with open(file_path, 'r') as file:
            for line in file:
                try:
                    # Split each line into key and frequency
                    key, freq = line.strip().split(':')
                    new_keys[key.strip()] = int(freq.strip())
                except ValueError:
                    # Skip invalid lines
                    logging.warning(f"Skipping invalid line: {line.strip()}")
    except FileNotFoundError:
        logging.error(f"File not found: {file_path}")
    except IOError:
        logging.error(f"Error reading file: {file_path}")
    return new_keys

# Updates training data with new keys
def update_training_data(training_data: List[Dict], mapped_keys: Dict[str, str]) -> Tuple[List[Dict], bool]:
    updated = False
    # Iterate over each entry in training data
    for entry in training_data:
        input_keys = list(entry["input"].keys())
        for input_key in input_keys:
            if input_key in mapped_keys:
                new_input_key = mapped_keys[input_key]
                if new_input_key != input_key:
                    # Update key in entry
                    entry["input"][new_input_key] = entry["input"].pop(input_key)
                    updated = True
    return training_data, updated

# Gets input text from an example
def get_input_text(example: Dict) -> str:
    input_key = list(example["input"].keys())[0]
    input_value = example["input"][input_key]
    # Format input text for the model
    return f"translate {input_key} : {input_value} to target"

# Gets target text from an example
def get_target_text(example: Dict) -> str:
    target_key = list(example["output"].keys())[0]
    target_value = example["output"][target_key]
    # Format output text for the model
    return f"{target_key} : {target_value}"

# Prepares data for training
def prepare_data(examples: List[Dict], tokenizer: T5Tokenizer, batch_size: int = 16) -> DataLoader:
    # Get input and target texts for each example
    input_texts = [get_input_text(ex) for ex in examples]
    target_texts = [get_target_text(ex) for ex in examples]

    # Tokenize input and target texts
    inputs = tokenizer(input_texts, return_tensors="pt", padding=True, truncation=True)
    targets = tokenizer(target_texts, return_tensors="pt", padding=True, truncation=True)

    # Create a TensorDataset and a DataLoader
    data = TensorDataset(inputs.input_ids, targets.input_ids)
    return DataLoader(data, batch_size=batch_size, shuffle=True)

# Processes training and validation data
def process_data(training_files: List[str], validation_file: str, unformatted_keys_file: str) -> Tuple[List[Dict], List[Dict]]:
    # Load training and validation data
    training_data, validation_data = load_data(training_files, validation_file)
    # Load new unformatted keys
    new_keys = load_unformatted_keys(unformatted_keys_file)
    mapped_keys = {key: key for key in new_keys}  # No synonym mapping
    # Update training data with new keys
    updated_training_data, updated = update_training_data(training_data, mapped_keys)
    if not updated:
        logging.info("No updates made to the training data.")
        return training_data, validation_data

    # Save updated training data to a temporary file
    temp_file = "ia/data/training_examples_updated.json"
    with open(temp_file, "w") as f:
        json.dump(updated_training_data, f, indent=2)

    # Compare temporary file with original file and update if changes detected
    if compare_json_files(training_files[0], temp_file):
        backup_and_update_file(training_files[0], updated_training_data)
        reset_file(unformatted_keys_file)
        logging.info("Training data updated and unformatted keys reset.")
    else:
        logging.info("No changes detected in training data.")

    return updated_training_data, validation_data
