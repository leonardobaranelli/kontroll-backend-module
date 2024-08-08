import Express from 'express';
import AiParserController from '../controllers/ai-parser.controller';

const router = Express.Router();

//POST
router.post('/parse', AiParserController.parseAndCreate);

//GET

// Parseador de entrada, busca en la base de datos el diccionario de mapeo y si no lo encuentra, lo parsea con la IA, si lo encuentra,
// lo parsea con el diccionario de mapeo
router.get(
  '/parse/:carrier/:trackingId',
  AiParserController.parseShipmentEntry,
);

// Parseador de envío, solo parsea con la IA
router.get('/ai-parse/:carrier/:trackingId', AiParserController.parseShipment);

// Parseador de envío, parsea con el diccionario de mapeo
router.get(
  '/memory-parse/:carrier/:trackingId',
  AiParserController.parseShipmentWithMemory,
);

export default router;
