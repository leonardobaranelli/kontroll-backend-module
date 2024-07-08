import os
import logging

# File paths
BASE_PATH = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # Base project path
MODEL_PATH = os.path.join(BASE_PATH, 'models', 'fine-tuned-t5-base')  # Fine-tuned model path
TRAINING_FILES = ["data/training_examples.json", "data/training_examples_updated.json"]  # Training data files
VALIDATION_FILE = "data/training_validation.json"  # Validation data file
UNFORMATTED_KEYS_FILE = "data/unformatted_keys.txt"  # Unformatted keys file

# Hyperparameters
LEARNING_RATE = 1e-4  # Learning rate
NUM_EPOCHS = 5  # Number of epochs
BATCH_SIZE = 16  # Batch size
PATIENCE = 3  # Number of epochs with no improvement before stopping training

# Hyperparameters for fine-tuning
RETRAIN_LEARNING_RATE = 5e-5  # Learning rate for fine-tuning
RETRAIN_NUM_EPOCHS = 3  # Number of epochs for fine-tuning
RETRAIN_BATCH_SIZE = 16  # Batch size for fine-tuning
RETRAIN_PATIENCE = 2  # Number of epochs with no improvement before stopping fine-tuning

# Logging configuration
LOG_FORMAT = '%(asctime)s - %(levelname)s - %(message)s'  # Logging format
LOG_LEVEL = logging.INFO  # Logging level

# T5 Model
MODEL_NAME = 't5-base'  # T5 model name
