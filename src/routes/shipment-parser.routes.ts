import { Router } from 'express';
import ShipmentParserController from '../controllers/shipment-parser.controller';

const router = Router();

router.post('/parse', ShipmentParserController.parseShipment);
router.post('/memory-parse', ShipmentParserController.parseShipmentWithMemory);

export default router;
