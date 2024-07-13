import json
from config.shipment_structure import SHIPMENT_STRUCTURE
from utils.logging_utils import get_logger
from utils.file_utils import initialize_keys, process_nested_fields, map_to_shipment_structure

logger = get_logger(__name__)

def parse_shipment(input_data):
    logger.info('Starting shipment parsing')
    
    if not isinstance(input_data, str):
        logger.error('Input data is not a JSON string')
        raise ValueError('Input data must be a JSON string')
    
    try:
        result = map_to_shipment_structure(input_data)
        logger.info('Shipment parsing completed')
        return result
    except Exception as e:
        logger.error(f'Error during shipment parsing: {str(e)}')
        raise