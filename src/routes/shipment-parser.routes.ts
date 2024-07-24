import { Router } from 'express';
import ShipmentParserController from '../controllers/shipment-parser.controller';

const router = Router();

router.post('/parse', ShipmentParserController.parseShipment);
router.get('/memory-parse', ShipmentParserController.getMemoryShipments);
router.delete('/clear-memory', ShipmentParserController.clearMemoryShipments);

export default router;
