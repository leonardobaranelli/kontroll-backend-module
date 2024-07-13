import csv
import random
from datetime import datetime, timedelta

def random_date(start, end):
    return start + timedelta(seconds=random.randint(0, int((end - start).total_seconds())))

def generate_tracking_number():
    prefixes = ['1Z', 'FDX', 'DHL', 'UPS']
    return f"{random.choice(prefixes)}{''.join([str(random.randint(0, 9)) for _ in range(12)])}"

def generate_location():
    cities = ["New York", "London", "Berlin", "Paris", "Tokyo", "Beijing", "Sydney", "Toronto", "Mumbai", "Dubai"]
    countries = ["US", "GB", "DE", "FR", "JP", "CN", "AU", "CA", "IN", "AE"]
    return random.choice(cities), random.choice(countries)

def generate_weight():
    return round(random.uniform(0.1, 100.0), 2)

def generate_volume():
    return round(random.uniform(0.001, 1.0), 3)

def generate_product_type():
    products = ["Express", "Standard", "Economy", "Next Day Air", "2nd Day Air", "Ground", "Freight", "Same Day"]
    return random.choice(products)

def generate_status():
    statuses = ["Picked up", "In transit", "Out for delivery", "Delivered", "Exception", "Customs clearance", "Arrived at facility", "Departed facility"]
    return random.choice(statuses)

data = []
labels = ["HousebillNumber", "Origin", "Destination", "DateAndTimes", "ProductType", "TotalPackages", "TotalWeight", "TotalVolume", "Timestamp"]

start_date = datetime(2023, 1, 1)
end_date = datetime(2024, 12, 31)

for _ in range(80):  # Generar 1000 ejemplos
    tracking_number = generate_tracking_number()
    origin_city, origin_country = generate_location()
    dest_city, dest_country = generate_location()
    weight = generate_weight()
    volume = generate_volume()
    product_type = generate_product_type()
    packages = random.randint(1, 10)
    
    for label in labels:
        if label == "HousebillNumber":
            premise = f"Shipment ID: {tracking_number}"
        elif label == "Origin":
            premise = f"Origin: {origin_city}, {origin_country}"
        elif label == "Destination":
            premise = f"Destination: {dest_city}, {dest_country}"
        elif label == "DateAndTimes":
            date = random_date(start_date, end_date)
            premise = f"Scheduled {label}: {date.strftime('%Y-%m-%d %H:%M:%S')}"
        elif label == "ProductType":
            premise = f"Service Type: {product_type}"
        elif label == "TotalPackages":
            premise = f"Number of Packages: {packages}"
        elif label == "TotalWeight":
            premise = f"Package Weight: {weight} KG"
        elif label == "TotalVolume":
            premise = f"Package Volume: {volume} m³"
        elif label == "Timestamp":
            date = random_date(start_date, end_date)
            status = generate_status()
            premise = f"Shipment Status: {status} at {date.strftime('%Y-%m-%d %H:%M:%S')}"
        
        data.append({
            "premise": premise,
            "hypothesis": f"This example is about {label}",
            "label": "entailment"
        })
        
        # Agregar un ejemplo de contradicción
        if label != "HousebillNumber":
            wrong_label = random.choice([l for l in labels if l != label])
            data.append({
                "premise": premise,
                "hypothesis": f"This example is about {wrong_label}",
                "label": "contradiction"
            })

# Mezclar los datos
random.shuffle(data)

# Escribir a CSV
with open('shipment_dataset_robust.csv', 'w', newline='', encoding='utf-8') as file:
    writer = csv.DictWriter(file, fieldnames=["premise", "hypothesis", "label"])
    writer.writeheader()
    writer.writerows(data)

print(f"Dataset guardado como 'shipment_dataset_robust.csv' con {len(data)} ejemplos.")
