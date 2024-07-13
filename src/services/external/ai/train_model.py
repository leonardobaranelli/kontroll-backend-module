<<<<<<< HEAD
import os
import logging
from transformers import BartForConditionalGeneration, BartTokenizer
from .utils.train_utils import train
from .config.file_paths import TRAINING_FILE, MODEL_PATH
from .config.hyperparameters import LEARNING_RATE, NUM_EPOCHS, BATCH_SIZE, PATIENCE, ACCUMULATION_STEPS, NUM_WARMUP_STEPS, WEIGHT_DECAY
from .config.logging_config import LOG_FORMAT, LOG_LEVEL
from .config.model_config import MODEL_NAME
from torch.cuda.amp import GradScaler
=======
import logging
from utils.train_utils import train
from config import TRAINING_FILES, VALIDATION_FILE, MODEL_PATH, LEARNING_RATE, NUM_EPOCHS, BATCH_SIZE, LOG_FORMAT, LOG_LEVEL, PATIENCE
>>>>>>> e78ce53b8318022d50c89b97176a182af2553bff

# Configure logging with the specified level and format
logging.basicConfig(level=LOG_LEVEL, format=LOG_FORMAT)

def main():
    # Start the training process
    logging.info("Starting training process...")
    
<<<<<<< HEAD
    # Check if the training file exists
    if not os.path.exists(TRAINING_FILE):
        logging.error(f"Training file not found: {TRAINING_FILE}")
        return
    
    # Load BART model and tokenizer
    model = BartForConditionalGeneration.from_pretrained(MODEL_NAME)
    tokenizer = BartTokenizer.from_pretrained(MODEL_NAME)

    # Call the training function with the specified parameters
    scaler = GradScaler()
    train(
        [TRAINING_FILE],  # Ensure this is a list
        MODEL_PATH,
        model,
        tokenizer,
        learning_rate=LEARNING_RATE,
        num_epochs=NUM_EPOCHS,
        batch_size=BATCH_SIZE,
        patience=PATIENCE,
        accumulation_steps=ACCUMULATION_STEPS,
        num_warmup_steps=NUM_WARMUP_STEPS,
        weight_decay=WEIGHT_DECAY,
        scaler=scaler
=======
    # Call the training function with the specified parameters
    train(
        TRAINING_FILES,
        VALIDATION_FILE,
        MODEL_PATH,
        learning_rate=LEARNING_RATE,
        num_epochs=NUM_EPOCHS,
        batch_size=BATCH_SIZE,
        patience=PATIENCE
>>>>>>> e78ce53b8318022d50c89b97176a182af2553bff
    )
    
    # Indicate that training has been completed
    logging.info("Training completed.")

# Execute the main function if the script is run directly
if __name__ == "__main__":
<<<<<<< HEAD
    main()
=======
    main()
>>>>>>> e78ce53b8318022d50c89b97176a182af2553bff
