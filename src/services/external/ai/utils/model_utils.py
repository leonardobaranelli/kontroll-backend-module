import os
import logging
from typing import Tuple
import torch
import torch_directml
from ..config.model_config import MODEL_NAME
from transformers import PreTrainedModel, PreTrainedTokenizer, BartForConditionalGeneration, BartTokenizer

# Saves the model and tokenizer to the specified directory
def save_model(model: PreTrainedModel, tokenizer: PreTrainedTokenizer, save_directory: str) -> None:
    try:
        # Move model to CPU before saving to avoid issues with device-specific tensors
        model.to('cpu')
        # Save the model and tokenizer to the directory
        model.save_pretrained(save_directory)
        tokenizer.save_pretrained(save_directory)
        logging.info(f"Model and tokenizer saved to {save_directory}")
    except Exception as e:
        logging.error(f"Error saving model and tokenizer: {e}")

# Loads the model and tokenizer from the specified directory
def load_model(model_class: type, tokenizer_class: type, model_path: str) -> Tuple[PreTrainedModel, PreTrainedTokenizer]:
    try:
        # Load the model and tokenizer from the directory
        model = model_class.from_pretrained(model_path)
        tokenizer = tokenizer_class.from_pretrained(model_path)
        logging.info(f"Model and tokenizer loaded from {model_path}")
        return model, tokenizer
    except Exception as e:
        logging.error(f"Error loading model and tokenizer: {e}")
        raise

# Initializes the model and tokenizer, either from scratch or from an existing directory
def initialize_model(model_path: str, from_scratch: bool = False) -> Tuple[BartForConditionalGeneration, BartTokenizer]:
    if from_scratch or not os.path.exists(model_path):
        # Initialize the model and tokenizer from the Hugging Face base model
        model = BartForConditionalGeneration.from_pretrained(MODEL_NAME)
        tokenizer = BartTokenizer.from_pretrained(MODEL_NAME)
    else:
        # Load the model and tokenizer from the specified directory
        model = BartForConditionalGeneration.from_pretrained(model_path)
        tokenizer = BartTokenizer.from_pretrained(model_path)
    return model, tokenizer

# Gets the device (GPU if available, otherwise CPU)
def get_device() -> torch.device:
    if torch.cuda.is_available():
        return torch.device("cuda")
    elif torch.backends.mps.is_available():
        return torch.device("mps")
    elif torch_directml.is_available():
        return torch_directml.device()
    else:
        return torch.device("cpu")