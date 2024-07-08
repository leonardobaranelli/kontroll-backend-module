from flask import Flask
from routes.shipment_routes import shipment_bp

# Create an instance of the Flask application.
app = Flask(__name__)

# Register the shipment routes blueprint.
app.register_blueprint(shipment_bp)

# Run the Flask application on the specified host and port.
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
