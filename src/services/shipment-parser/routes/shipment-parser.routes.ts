import { Router } from 'express';
import ShipmentParserController from '../controllers/shipment-parser.controller';

const router = Router();

router.post('/parse', ShipmentParserController.parse);

export default router;
