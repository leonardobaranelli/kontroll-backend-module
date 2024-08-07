import Express from 'express';
import ParsingDictionaryController from '../controllers/parsing-dictionary.controller';

const router = Express.Router();

router.get('/', ParsingDictionaryController.getAll);
router.get('/:id', ParsingDictionaryController.getById);
router.post('/', ParsingDictionaryController.create);
router.put('/:id', ParsingDictionaryController.update);
router.delete('/:id', ParsingDictionaryController.delete);
router.get('/carrier/:carrier', ParsingDictionaryController.getByCarrier);

export default router;
