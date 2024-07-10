import os
from config import MODEL_PATH, MODEL_NAME
from utils.model_utils import initialize_model

# Initialize the model and the tokenizer
model, tokenizer = initialize_model(MODEL_PATH)

# Export the variables
__all__ = ['model', 'tokenizer', 'MODEL_PATH', 'MODEL_NAME']