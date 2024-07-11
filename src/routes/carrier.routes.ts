import Express from 'express';
import CarrierController from '../controllers/carrier.controller';

const router = Express.Router();

//POST
router.post('/', CarrierController.create);

export default router;
