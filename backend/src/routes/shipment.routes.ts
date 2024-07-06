import Express from 'express';
import ShipmentController from '../controllers/shipment.controller';

const router = Express.Router();

//GET
router.get('/', ShipmentController.getAll);
router.get('/name/:name', ShipmentController.getByName);
router.get(
  '/trackingNumber/:trackingNumber',
  ShipmentController.getByTrackingNumber,
);
router.get('/id/:id', ShipmentController.getById);

//POST
router.post('/', ShipmentController.create);

//PUT
router.put('/name/:name', ShipmentController.updateByName);
router.put(
  '/trackingNumber/:trackingNumber',
  ShipmentController.updateByTrackingNumber,
);
router.put('/id/:id', ShipmentController.updateById);

//DELETE
router.delete('/all', ShipmentController.deleteAll);
router.delete('/name/:name', ShipmentController.deleteByName);
router.delete(
  '/trackingNumber/:trackingNumber',
  ShipmentController.deleteByTrackingNumber,
);
router.delete('/id/:id', ShipmentController.deleteById);

export default router;
