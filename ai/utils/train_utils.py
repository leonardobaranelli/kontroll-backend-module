import logging
import torch
from typing import List
from torch.utils.data import DataLoader
from tqdm import tqdm
from transformers import T5ForConditionalGeneration
from utils.data_utils import load_data, prepare_data
from utils.model_utils import save_model, initialize_model, get_device

# Function to train the model
def train_model(model: T5ForConditionalGeneration, train_loader: DataLoader, optimizer: torch.optim.Optimizer, device: torch.device) -> float:
    model.train()  # Sets the model to training mode
    total_loss = 0
    progress_bar = tqdm(train_loader, desc="Training")  # Progress bar for training
    
    for batch in progress_bar:
        input_ids, target_ids = [b.to(device) for b in batch]  # Move data to device (GPU or CPU)
        optimizer.zero_grad()  # Reset optimizer gradients
        outputs = model(input_ids=input_ids, labels=target_ids)  # Pass data through the model
        loss = outputs.loss  # Get the loss
        total_loss += loss.item()  # Accumulate total loss
        loss.backward()  # Compute gradients
        optimizer.step()  # Update model parameters
        progress_bar.set_postfix({"loss": loss.item()})  # Update progress bar with current loss
    
    avg_train_loss = total_loss / len(train_loader)  # Compute average loss
    return avg_train_loss

# Function to validate the model
def validate_model(model: T5ForConditionalGeneration, val_loader: DataLoader, device: torch.device) -> float:
    model.eval()  # Sets the model to evaluation mode
    total_loss = 0
    progress_bar = tqdm(val_loader, desc="Validating")  # Progress bar for validation
    
    with torch.no_grad():  # Disable gradient computation
        for batch in progress_bar:
            input_ids, target_ids = [b.to(device) for b in batch]  # Move data to device
            outputs = model(input_ids=input_ids, labels=target_ids)  # Pass data through the model
            loss = outputs.loss  # Get the loss
            total_loss += loss.item()  # Accumulate total loss
            progress_bar.set_postfix({"loss": loss.item()})  # Update progress bar with current loss
    
    avg_val_loss = total_loss / len(val_loader)  # Compute average loss
    return avg_val_loss

# Main function to train the model from scratch
def train(training_files: List[str], validation_file: str, model_save_path: str, learning_rate: float, num_epochs: int, batch_size: int, patience: int):
    training_data, validation_data = load_data(training_files, validation_file)  # Load training and validation data
    model, tokenizer = initialize_model(model_save_path, from_scratch=True)  # Initialize model from scratch
    device = get_device()  # Get device (GPU or CPU)
    model.to(device)  # Move model to device

    train_loader = prepare_data(training_data, tokenizer, batch_size)  # Prepare training data
    val_loader = prepare_data(validation_data, tokenizer, batch_size)  # Prepare validation data

    optimizer = torch.optim.AdamW(model.parameters(), lr=learning_rate)  # Initialize optimizer
    best_val_loss = float('inf')  # Initialize best validation loss
    epochs_without_improvement = 0  # Counter for epochs without improvement

    for epoch in range(num_epochs):
        logging.info(f"Epoch {epoch+1}/{num_epochs}")  # Log current epoch
        
        train_loss = train_model(model, train_loader, optimizer, device)  # Train the model
        logging.info(f"Training loss: {train_loss:.4f}")  # Log training loss

        val_loss = validate_model(model, val_loader, device)  # Validate the model
        logging.info(f"Validation loss: {val_loss:.4f}")  # Log validation loss

        if val_loss < best_val_loss:
            best_val_loss = val_loss  # Update best validation loss
            save_model(model, tokenizer, model_save_path)  # Save the model
            logging.info("Model saved")  # Log model saved
            epochs_without_improvement = 0  # Reset epochs without improvement counter
        else:
            epochs_without_improvement += 1  # Increment epochs without improvement counter
            if epochs_without_improvement >= patience:
                logging.info(f"Early stopping triggered after {epoch+1} epochs")  # Log early stopping
                break

    return model, tokenizer

# Main function to retrain the existing model
def retrain(training_files: List[str], validation_file: str, model_save_path: str, learning_rate: float, num_epochs: int, batch_size: int, patience: int):
    training_data, validation_data = load_data(training_files, validation_file)  # Load training and validation data
    model, tokenizer = initialize_model(model_save_path)  # Initialize model from specified directory
    device = get_device()  # Get device (GPU or CPU)
    model.to(device)  # Move model to device

    train_loader = prepare_data(training_data, tokenizer, batch_size)  # Prepare training data
    val_loader = prepare_data(validation_data, tokenizer, batch_size)  # Prepare validation data

    optimizer = torch.optim.AdamW(model.parameters(), lr=learning_rate)  # Initialize optimizer
    best_val_loss = float('inf')  # Initialize best validation loss
    epochs_without_improvement = 0  # Counter for epochs without improvement

    for epoch in range(num_epochs):
        logging.info(f"Epoch {epoch+1}/{num_epochs}")  # Log current epoch
        
        train_loss = train_model(model, train_loader, optimizer, device)  # Train the model
        logging.info(f"Training loss: {train_loss:.4f}")  # Log training loss

        val_loss = validate_model(model, val_loader, device)  # Validate the model
        logging.info(f"Validation loss: {val_loss:.4f}")  # Log validation loss

        if val_loss < best_val_loss:
            best_val_loss = val_loss  # Update best validation loss
            save_model(model, tokenizer, model_save_path)  # Save the model
            logging.info("Model saved")  # Log model saved
            epochs_without_improvement = 0  # Reset epochs without improvement counter
        else:
            epochs_without_improvement += 1  # Increment epochs without improvement counter
            if epochs_without_improvement >= patience:
                logging.info(f"Early stopping triggered after {epoch+1} epochs")  # Log early stopping
                break

