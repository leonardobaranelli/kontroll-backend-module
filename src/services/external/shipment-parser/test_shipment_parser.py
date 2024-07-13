import json
from main import parse_shipment
from config.input_config import INPUT_FILE

def load_input_from_config():
    with open(INPUT_FILE, 'r') as input_file:
        return input_file.read()

def test_parse_shipment():
    input_data = load_input_from_config()
    result = parse_shipment(input_data)
    print(json.dumps(result, indent=2))

if __name__ == "__main__":
    test_parse_shipment()