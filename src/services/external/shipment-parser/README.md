# Shipment Parser

This project contains a parser for shipment data, designed to process and validate JSON input containing shipment information.

## Project Structure

- `src/services/external/shipment-parser/`
  - `config/`: Configuration files for input and shipment data structure
    - `input_config.py`: Defines the input file path
    - `shipment_structure.py`: Defines the shipment data structure
    - `model_config.py`: Defines the model name and shipment synonyms
  - `core/`: Core parser logic
    - `classifier.py`: Classification functions
    - `mapper.py`: Mapping functions
    - `preprocessor.py`: Preprocessing functions
  - `utils/`: Utility functions
    - `ai_utils.py`: Utility functions for the AI parser
    - `file_utils.py`: Utility functions for file operations
    - `logging_utils.py`: Logging configuration and functions
  - `data/`: Data files
    - `dhl_shipment_example.json`: Sample DHL shipment data
  - `main.py`: Main entry point for the parser
  - `server.py`: Flask server for the parser
  - `test_shipment_parser.py`: Test case using fixed input data for the parser
  - `requirements.txt`: List of project dependencies

## Installation

1. Clone the repository containing the shipment-parser project.
2. Navigate to the project directory:
   ```
   cd src/services/external/shipment-parser
   ```
3. Create a virtual environment:
   ```
   python -m venv venv
   ```
4. Activate the virtual environment:
   - On Windows:
     ```
     venv\Scripts\activate
     ```
   - On macOS and Linux:
     ```
     source venv/bin/activate
     ```
5. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
6. Run the server:
   ```
   python -m server.py
   ```
7. Run the tests:
   ```
   python -m test_shipment_parser
   ```

## Testing Input Configuration

To change the input file:

1. Open `src/services/external/shipment-parser/config/input_config.py`
2. Modify the `INPUT_FILE` value to point to your desired JSON input file.
3. Save the configuration file.

Example `input_config.py`:

```python
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
INPUT_FILE = os.path.join(BASE_DIR, 'data', 'dhl_shipment_example.json')
```

## Synonyms

The synonyms are defined in the `model_config.py` file.
You can add more synonyms to the `SYNONYMS` dictionary for each label.
They will be used to help the mapping of the input shipment data to the shipment data structure.

## In order to parse the shipment data, you can use the following endpoint:

`http://localhost:5000/parse_shipment`

## Development

To contribute to the project, make sure to follow the established coding conventions and add tests for any new functionality.
