import os

BASE_PATH = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_PATH, 'models', 'fine-tuned-bart')
TOKENIZER_PATH = MODEL_PATH  # Added this line
TRAINING_FILE = os.path.join(BASE_PATH, "data", "training_keys.json")
VALIDATION_FILE = os.path.join(BASE_PATH, "data", "training_validation.json")
UNFORMATTED_KEYS_FILE = os.path.join(BASE_PATH, "data", "unformatted_keys.txt")