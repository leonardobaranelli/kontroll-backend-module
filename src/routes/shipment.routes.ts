import Express from 'express';
import ShipmentController from '../controllers/shipment.controller';
import ShipmentControllerFirebase from '../controllers/shipment-firebase.controller';

const router = Express.Router();

//GET
router.get('/', ShipmentController.getAll);
router.get('/firebase/:carrier', ShipmentControllerFirebase.getByCarrier);
router.get(
  '/firebase/:carrier/:id',
  ShipmentControllerFirebase.getByCarrierAndId,
);

//POST
router.post('/', ShipmentController.create);

//PUT
router.put('/name/:name', ShipmentController.updateByNumber);

//DELETE
router.delete('/all', ShipmentController.deleteAll);
router.delete('/name/:name', ShipmentController.deleteByNumber);

export default router;
