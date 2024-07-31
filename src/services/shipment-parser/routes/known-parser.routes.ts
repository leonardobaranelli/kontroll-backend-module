import { Router } from 'express';
import { knownParserController } from '../controllers/known-parser.controller';

const router = Router();

router.post('/parse_known', knownParserController);

export default router;
