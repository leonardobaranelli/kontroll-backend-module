import torch
from transformers import BartForConditionalGeneration, BartTokenizer
from ..config.file_paths import MODEL_PATH, TOKENIZER_PATH

# Define el camino hacia tu modelo y tokenizador entrenados
model_path = MODEL_PATH
tokenizer_path = TOKENIZER_PATH

# Carga el modelo y el tokenizador
model = BartForConditionalGeneration.from_pretrained(model_path)
tokenizer = BartTokenizer.from_pretrained(tokenizer_path)

# Pon el modelo en modo de evaluación
model.eval()

# Función para realizar inferencia
def translate_input(input_text, model, tokenizer):
    # Desactiva el cálculo de gradientes
    with torch.no_grad():
        # Tokeniza la entrada
        inputs = tokenizer(input_text, return_tensors="pt", max_length=512, truncation=True)
        
        # Genera la salida con longitud de secuencia controlada
        outputs = model.generate(
            inputs['input_ids'], 
            max_length=50,  # Limitar la longitud de la secuencia generada
            num_beams=4, 
            early_stopping=True,
            no_repeat_ngram_size=3,
            bos_token_id=tokenizer.bos_token_id,
            eos_token_id=tokenizer.eos_token_id
        )
        
        # Decodifica la salida
        return tokenizer.decode(outputs[0], skip_special_tokens=True)

# Prueba con un ejemplo
input_texts = [
    "id: GMDBD8E9CCE94842E495B7",
    "id: ABC123XYZ456",
    "origin.address.countryCode: US",
    "origin.address.countryCode: CA",
    "origin.address.addressLocality: AMERICAN FORK",
    "origin.address.addressLocality: TORONTO",
    "destination.address.countryCode: GB",
    "destination.address.countryCode: FR",
    "destination.address.addressLocality: SHEFFIELD",
    "destination.address.addressLocality: PARIS",
    "status.timestamp: 2023-01-29T16:02:00",
    "status.timestamp: 2023-05-15T09:30:00",
    "service: ecommerce",
    "service: express",
    "details.weight.value: 0.831",
    "details.weight.value: 2.5",
    "details.weight.unitText: LB",
    "details.weight.unitText: KG",
    "status.statusCode: transit",
    "status.statusCode: delivered",
    "status.status: ARRIVED AT CUSTOMS",
    "status.status: OUT FOR DELIVERY",
    "status.timestamp: 2023-01-29T16:02:00",
    "status.timestamp: 2023-06-01T08:45:00",
    "status.location.address.addressLocality: HEATHROW, GB",
    "status.location.address.addressLocality: JFK, US"
]

if __name__ == "__main__":
    print("Modelo y tokenizador cargados correctamente.")
    for input_text in input_texts:
        output_text = translate_input(input_text, model, tokenizer)
        print(f"Input: {input_text}")
        print(f"Output: {output_text}")
        print("-" * 50)
