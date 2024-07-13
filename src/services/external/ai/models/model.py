import os
<<<<<<< HEAD
from config import MODEL_PATH, MODEL_NAME
from utils.model_utils import initialize_model

# Initialize the model and the tokenizer
model, tokenizer = initialize_model(MODEL_PATH)

# Export the variables
__all__ = ['model', 'tokenizer', 'MODEL_PATH', 'MODEL_NAME']
=======
from utils.model_utils import initialize_model

# Define the base path of the project
base_path = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Define the model path
model_path = os.path.join(base_path, 'models', 'fine-tuned-t5-base')

# Initialize the model and the tokenizer
model, tokenizer = initialize_model(model_path)

# Export the variables
__all__ = ['model', 'tokenizer', 'model_path']
>>>>>>> e78ce53b8318022d50c89b97176a182af2553bff
