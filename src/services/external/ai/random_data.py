import json
import random
from datetime import datetime, timedelta

def generate_random_date():
    start_date = datetime(2022, 1, 1)
    end_date = datetime.now()
    time_between_dates = end_date - start_date
    days_between_dates = time_between_dates.days
    random_number_of_days = random.randrange(days_between_dates)
    random_date = start_date + timedelta(days=random_number_of_days)
    return random_date.strftime("%Y-%m-%dT%H:%M:%S")

def generate_random_weight():
    return round(random.uniform(0.1, 50.0), 2)

def generate_random_status():
    statuses = ["transit", "delivered", "processing", "on hold", "customs clearance"]
    descriptions = ["ARRIVED AT CUSTOMS", "OUT FOR DELIVERY", "PACKAGE RECEIVED", "PROCESSING AT SORTING CENTER", "CLEARED CUSTOMS"]
    return random.choice(statuses), random.choice(descriptions)

def generate_training_example():
    housebill_number = f"GMD{''.join(random.choices('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', k=18))}"
    origin_country = random.choice(["US", "CA", "MX", "GB", "DE", "FR", "ES", "IT"])
    destination_country = random.choice(["US", "CA", "MX", "GB", "DE", "FR", "ES", "IT"])
    
    input_data = {
        "id": housebill_number,
        "service": random.choice(["ecommerce", "express", "freight"]),
        "origin": {
            "address": {
                "countryCode": origin_country,
                "addressLocality": f"CITY_{origin_country}"
            }
        },
        "destination": {
            "address": {
                "countryCode": destination_country,
                "addressLocality": f"CITY_{destination_country}"
            }
        },
        "status": {
            "timestamp": generate_random_date(),
            "statusCode": "transit",
            "status": "IN TRANSIT"
        },
        "details": {
            "weight": {
                "value": generate_random_weight(),
                "unitText": random.choice(["LB", "KG"])
            }
        }
    }

    output_data = {
        "HousebillNumber": housebill_number,
        "Origin": {
            "LocationCode": origin_country,
            "LocationName": f"CITY_{origin_country}",
            "CountryCode": origin_country
        },
        "Destination": {
            "LocationCode": destination_country,
            "LocationName": f"CITY_{destination_country}",
            "CountryCode": destination_country
        },
        "DateAndTimes": {
            "ShipmentDate": input_data["status"]["timestamp"]
        },
        "ProductType": input_data["service"],
        "TotalWeight": {
            "*body": input_data["details"]["weight"]["value"],
            "@uom": input_data["details"]["weight"]["unitText"]
        },
        "Timestamp": [{
            "TimestampCode": input_data["status"]["statusCode"],
            "TimestampDescription": input_data["status"]["status"],
            "TimestampDateTime": input_data["status"]["timestamp"],
            "TimestampLocation": f"CITY_{destination_country}, {destination_country}"
        }]
    }

    return {
        "input": json.dumps(input_data),
        "output": json.dumps(output_data)
    }

def generate_training_data(num_examples):
    return [generate_training_example() for _ in range(num_examples)]

# Generate 1000 training examples
training_data = generate_training_data(1000)

# Save the generated data to a JSON file
with open('src/services/external/ai/data/generated_training_data.json', 'w') as f:
    json.dump(training_data, f, indent=2)

print("Generated training data saved to generated_training_data.json")