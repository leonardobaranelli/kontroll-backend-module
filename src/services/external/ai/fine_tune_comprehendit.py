import torch
import torch_directml
from datasets import load_dataset
from transformers import AutoTokenizer, AutoModelForSequenceClassification, TrainingArguments, Trainer
from .config.file_paths import TRAINING_FILE, MODEL_PATH
from .config.model_config import MODEL_NAME

# Verificar si hay GPU disponible con DirectML
device = torch_directml.device() if torch_directml.is_available() else torch.device("cpu")
print(f"Using device: {device}")

# Cargar el dataset
dataset = load_dataset('csv', data_files=TRAINING_FILE)
dataset = dataset['train'].train_test_split(test_size=0.2)

# Inicializar el tokenizador y el modelo
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForSequenceClassification.from_pretrained(MODEL_NAME, num_labels=3)  # 3 labels: entailment, contradiction, neutral
model.to(device)

def tokenize_function(examples):
    tokenized = tokenizer(examples["premise"], examples["hypothesis"], truncation=True, padding="max_length", max_length=128)
    tokenized["labels"] = [0 if label == "entailment" else 1 if label == "contradiction" else 2 for label in examples["label"]]
    return tokenized

tokenized_dataset = dataset.map(tokenize_function, batched=True, remove_columns=dataset['train'].column_names)

training_args = TrainingArguments(
    output_dir=MODEL_PATH,
    learning_rate=3e-5,
    per_device_train_batch_size=16,
    per_device_eval_batch_size=16,
    num_train_epochs=1,
    weight_decay=0.01,
    evaluation_strategy="epoch",
    save_strategy="epoch",
    load_best_model_at_end=True,
)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=tokenized_dataset['train'],
    eval_dataset=tokenized_dataset['test'],
    tokenizer=tokenizer,
)

print("Starting model training...")
trainer.train()

print("Evaluating the model...")
eval_results = trainer.evaluate()
print("Evaluation results:", eval_results)

print("Saving the fine-tuned model...")
trainer.save_model(MODEL_PATH)

print(f"Training complete. Model saved in '{MODEL_PATH}'")