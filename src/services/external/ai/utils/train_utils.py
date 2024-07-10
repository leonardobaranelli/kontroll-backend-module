import logging
import torch
from typing import List, Dict
from torch.utils.data import DataLoader, Dataset
from tqdm import tqdm
from transformers import BartForConditionalGeneration, BartTokenizer, AdamW, get_cosine_schedule_with_warmup, get_linear_schedule_with_warmup
from .data_utils import load_data
from .model_utils import save_model, get_device
import json
from torch.nn.utils import clip_grad_norm_
from sklearn.model_selection import train_test_split
from torch.cuda.amp import autocast, GradScaler

class ShipmentDataset(Dataset):
    def __init__(self, data: List[Dict], tokenizer: BartTokenizer, max_length: int = 512):
        self.data = data
        self.tokenizer = tokenizer
        self.max_length = max_length

    def __len__(self):
        return len(self.data)

    def __getitem__(self, idx):
        item = self.data[idx]
        input_text = item['input']
        target_text = item['output']

        # Ensure input_text and target_text are strings
        if not isinstance(input_text, str):
            input_text = json.dumps(input_text)
        if not isinstance(target_text, str):
            target_text = json.dumps(target_text)

        input_encoding = self.tokenizer.encode_plus(
            input_text,
            max_length=self.max_length,
            padding='max_length',
            truncation=True,
            return_tensors='pt'
        )

        target_encoding = self.tokenizer.encode_plus(
            target_text,
            max_length=self.max_length,
            padding='max_length',
            truncation=True,
            return_tensors='pt'
        )

        input_ids = input_encoding['input_ids'].squeeze()
        attention_mask = input_encoding['attention_mask'].squeeze()
        labels = target_encoding['input_ids'].squeeze()

        if input_ids.size(0) > self.max_length:
            input_ids = input_ids[:self.max_length]
            attention_mask = attention_mask[:self.max_length]
        if labels.size(0) > self.max_length:
            labels = labels[:self.max_length]

        return {
            'input_ids': input_ids,
            'attention_mask': attention_mask,
            'labels': labels
        }

def train_model(model: BartForConditionalGeneration, train_loader: DataLoader, optimizer: torch.optim.Optimizer, device: torch.device, scheduler, accumulation_steps: int, scaler: GradScaler) -> float:
    model.train()
    total_loss = 0
    progress_bar = tqdm(train_loader, desc="Training")
    
    optimizer.zero_grad()
    
    for i, batch in enumerate(progress_bar):
        input_ids = batch['input_ids'].to(device)
        attention_mask = batch['attention_mask'].to(device)
        labels = batch['labels'].to(device)

        with autocast():
            outputs = model(input_ids=input_ids, attention_mask=attention_mask, labels=labels)
            loss = outputs.loss / accumulation_steps

        scaler.scale(loss).backward()
        total_loss += loss.item()

        if (i + 1) % accumulation_steps == 0:
            scaler.unscale_(optimizer)
            torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)
            scaler.step(optimizer)
            scaler.update()
            scheduler.step()
            optimizer.zero_grad()
        
        progress_bar.set_postfix({"loss": loss.item()})
    
    if len(train_loader) % accumulation_steps != 0:
        scaler.unscale_(optimizer)
        torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)
        scaler.step(optimizer)
        scaler.update()
        scheduler.step()
        optimizer.zero_grad()

    avg_train_loss = total_loss / len(train_loader)
    return avg_train_loss

def train(training_files: List[str], model_path: str, model: BartForConditionalGeneration, tokenizer: BartTokenizer, learning_rate: float, num_epochs: int, batch_size: int, patience: int, accumulation_steps: int, num_warmup_steps: float, weight_decay: float, scaler: GradScaler):
    training_data, _ = load_data(training_files, None)
    
    if not training_data:
        logging.error("Training data is empty.")
        return
    
    device = get_device()
    print(f"Using device: {device}")
    model.to(device)

    # Data augmentation
    augmented_data = data_augmentation(training_data)
    train_data, val_data = train_test_split(augmented_data, test_size=0.1)

    train_dataset = ShipmentDataset(train_data, tokenizer)
    val_dataset = ShipmentDataset(val_data, tokenizer)

    if len(train_dataset) == 0:
        logging.error("Training dataset is empty.")
        return

    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True)
    val_loader = DataLoader(val_dataset, batch_size=batch_size, shuffle=False)

    optimizer = AdamW(model.parameters(), lr=learning_rate, weight_decay=weight_decay)
    total_steps = len(train_loader) * num_epochs
    scheduler = get_cosine_schedule_with_warmup(optimizer, num_warmup_steps=num_warmup_steps, num_training_steps=total_steps)
    
    best_val_loss = float('inf')
    epochs_without_improvement = 0

    for epoch in range(num_epochs):
        logging.info(f"Epoch {epoch+1}/{num_epochs}")
        
        train_loss = train_model(model, train_loader, optimizer, device, scheduler, accumulation_steps, scaler)
        val_loss = evaluate_model(model, val_loader, device)
        
        logging.info(f"Training loss: {train_loss:.4f}")
        logging.info(f"Validation loss: {val_loss:.4f}")

        if val_loss < best_val_loss:
            best_val_loss = val_loss
            epochs_without_improvement = 0
            model.to('cpu')
            save_model(model, tokenizer, model_path)
            model.to(device)
            logging.info("Model saved")
        else:
            epochs_without_improvement += 1

        if epochs_without_improvement >= patience:
            logging.info("Early stopping")
            break

    return model, tokenizer

def evaluate_model(model: BartForConditionalGeneration, val_loader: DataLoader, device: torch.device) -> float:
    model.eval()
    total_loss = 0
    with torch.no_grad():
        for batch in val_loader:
            input_ids = batch['input_ids'].to(device)
            attention_mask = batch['attention_mask'].to(device)
            labels = batch['labels'].to(device)

            outputs = model(input_ids=input_ids, attention_mask=attention_mask, labels=labels)
            loss = outputs.loss
            total_loss += loss.item()
    
    avg_val_loss = total_loss / len(val_loader)
    return avg_val_loss

def retrain(training_files: List[str], model_path: str, model: BartForConditionalGeneration, tokenizer: BartTokenizer, learning_rate: float, num_epochs: int, batch_size: int, patience: int, accumulation_steps: int, num_warmup_steps: float, weight_decay: float):
    training_data, _ = load_data(training_files, None)  # No validation data
    device = get_device()
    model.to(device)

    train_dataset = ShipmentDataset(training_data, tokenizer)

    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True)

    optimizer = AdamW(model.parameters(), lr=learning_rate, weight_decay=weight_decay)  # Agregar weight_decay para regularización
    num_warmup_steps = int(num_warmup_steps * len(train_loader) * num_epochs)  # 10% del total de pasos de entrenamiento
    scheduler = get_linear_schedule_with_warmup(optimizer, num_warmup_steps=num_warmup_steps, num_training_steps=len(train_loader) * num_epochs)
    best_val_loss = float('inf')
    epochs_without_improvement = 0

    for epoch in range(num_epochs):
        logging.info(f"Epoch {epoch+1}/{num_epochs}")
        
        train_loss = train_model(model, train_loader, optimizer, device, scheduler, accumulation_steps)
        logging.info(f"Training loss: {train_loss:.4f}")

        # Save the model after each epoch
        model.to('cpu')
        save_model(model, tokenizer, model_path)
        model.to(device)
        logging.info("Model saved")

    return model, tokenizer

def data_augmentation(data: List[Dict]) -> List[Dict]:
    augmented_data = []
    for item in data:
        augmented_data.append(item)
        # Add simple augmentation techniques
        augmented_data.append({"input": item["input"].lower(), "output": item["output"]})
        augmented_data.append({"input": item["input"].upper(), "output": item["output"]})
    return augmented_data