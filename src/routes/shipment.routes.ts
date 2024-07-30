import Express from 'express';
import ShipmentController from '../controllers/shipment.controller';

const router = Express.Router();

//GET
router.get('/', ShipmentController.getAll);
router.get('/carrier/:carrier', ShipmentController.getByCarrier);

router.get(
  '/carrier/:carrier/:shipmentId',
  ShipmentController.getByCarrierAndId,
);

//POST
router.post('/', ShipmentController.create);

//PUT
router.put('/number/:number', ShipmentController.updateByNumber);

//DELETE
router.delete('/all', ShipmentController.deleteAll);
router.delete('/number/:number', ShipmentController.deleteByNumber);

export default router;
