from flask import Flask, request, jsonify
from main import parse_shipment

app = Flask(__name__)

@app.route('/parse_shipment', methods=['POST'])
def parse():
    data = request.json
    if not data or 'text' not in data:
        return jsonify({'error': 'Invalid input. Please provide text to parse.'}), 400
    
    text = data['text']
    try:
        parsed_data = parse_shipment(text)
        return jsonify(parsed_data)
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': 'An unexpected error occurred'}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)