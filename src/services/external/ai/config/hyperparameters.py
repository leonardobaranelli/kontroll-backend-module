# Training hyperparameters
LEARNING_RATE = 1e-7  # Further reduced from 5e-5
NUM_EPOCHS = 10
BATCH_SIZE = 1
PATIENCE = 3

# Other parameters
ACCUMULATION_STEPS = 16  # Increased from 8
NUM_WARMUP_STEPS = 0.2  # Reduced from 0.2
WEIGHT_DECAY = 0.01  # Reduced from 0.1

# Fine-tuning hyperparameters
RETRAIN_LEARNING_RATE = 5e-6  # Reduced from 5e-5
RETRAIN_NUM_EPOCHS = 3
RETRAIN_BATCH_SIZE = 1
RETRAIN_PATIENCE = 2