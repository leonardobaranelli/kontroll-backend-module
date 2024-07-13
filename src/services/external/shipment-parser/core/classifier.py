from transformers import pipeline
import torch
from config.model_config import MODEL_NAME

classifier = pipeline("zero-shot-classification", 
                      model=MODEL_NAME, 
                      device='cuda' if torch.cuda.is_available() else 'cpu')

def classify_batch(texts, labels, batch_size=32):
    results = []
    for i in range(0, len(texts), batch_size):
        batch = texts[i:i+batch_size]
        batch_results = classifier(batch, labels, multi_label=False)
        results.extend(batch_results)
    return results