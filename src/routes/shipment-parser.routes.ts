import { Router } from 'express';
import ShipmentParserController from '../controllers/shipment-parser.controller';

const router = Router();
// GET routes
// Parseador de entrada, busca en la base de datos el diccionario de mapeo y si no lo encuentra, lo parsea con la IA, si lo encuentra,
// lo parsea con el diccionario de mapeo
router.get(
  '/parse/:carrier/:trackingId',
  ShipmentParserController.parseShipmentEntry,
);

// Parseador de envío, solo parsea con la IA
router.get(
  '/ai-parse/:carrier/:trackingId',
  ShipmentParserController.parseShipmentWithAI,
);

// Parseador de envío, parsea con el diccionario de mapeo
router.get(
  '/memory-parse/:carrier/:trackingId',
  ShipmentParserController.parseShipmentWithMemory,
);
//Guarda shipments ya parseados en la base de datos
router.get(
  '/save/:carrierId/:housebillNumber',
  ShipmentParserController.saveParsedShipment,
);
export default router;
