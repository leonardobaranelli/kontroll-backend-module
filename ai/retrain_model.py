import logging
from utils.train_utils import retrain
from config import TRAINING_FILES, VALIDATION_FILE, MODEL_PATH, RETRAIN_LEARNING_RATE, RETRAIN_NUM_EPOCHS, RETRAIN_BATCH_SIZE, RETRAIN_PATIENCE, LOG_FORMAT, LOG_LEVEL

# Configure logging with the specified level and format
logging.basicConfig(level=LOG_LEVEL, format=LOG_FORMAT)

def main():
    # Start the incremental retraining process
    logging.info("Starting incremental training process...")
    
    # Call the retraining function with the specified parameters
    retrain(
        TRAINING_FILES,
        VALIDATION_FILE,
        MODEL_PATH,
        learning_rate=RETRAIN_LEARNING_RATE,
        num_epochs=RETRAIN_NUM_EPOCHS,
        batch_size=RETRAIN_BATCH_SIZE,
        patience=RETRAIN_PATIENCE
    )
    
    # Indicate that incremental training has been completed
    logging.info("Incremental training completed.")

# Execute the main function if the script is run directly
if __name__ == "__main__":
    main()

