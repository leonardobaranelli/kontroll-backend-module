import Express from 'express';
import CarrierController from '../controllers/carrier.controller';
import { checkIdParam } from '../middlewares/route-params.middleware';

const router = Express.Router();

//POST
router.post('/known', CarrierController.createKnown);
router.post('/new', CarrierController.createNew);

router.post('/dev', CarrierController.devCreate);

//GET
router.get('/', CarrierController.getAll);

//DELETE
router.delete('/all', CarrierController.deleteAll);

router.delete('/id/:id', checkIdParam, CarrierController.deleteById);

export default router;
