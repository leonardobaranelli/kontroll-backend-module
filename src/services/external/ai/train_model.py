import logging
from utils.train_utils import train
from config import TRAINING_FILES, VALIDATION_FILE, MODEL_PATH, LEARNING_RATE, NUM_EPOCHS, BATCH_SIZE, LOG_FORMAT, LOG_LEVEL, PATIENCE

# Configure logging with the specified level and format
logging.basicConfig(level=LOG_LEVEL, format=LOG_FORMAT)

def main():
    # Start the training process
    logging.info("Starting training process...")
    
    # Call the training function with the specified parameters
    train(
        TRAINING_FILES,
        VALIDATION_FILE,
        MODEL_PATH,
        learning_rate=LEARNING_RATE,
        num_epochs=NUM_EPOCHS,
        batch_size=BATCH_SIZE,
        patience=PATIENCE
    )
    
    # Indicate that training has been completed
    logging.info("Training completed.")

# Execute the main function if the script is run directly
if __name__ == "__main__":
    main()
