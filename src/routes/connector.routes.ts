import Express from 'express';
import ConnectorController from '../controllers/connector.controller';

const router = Express.Router();

//GET
router.get('/', ConnectorController.getAll);
router.get('/name/:name', ConnectorController.getByName);
router.get('/id/:id', ConnectorController.getById);

//POST
router.post('/', ConnectorController.create);

//PUT
router.put('/name/:name', ConnectorController.updateByName);
router.put('/id/:id', ConnectorController.updateById);

//DELETE
router.delete('/all', ConnectorController.deleteAll);
router.delete('/name/:name', ConnectorController.deleteByName);
router.delete('/id/:id', ConnectorController.deleteById);

export default router;
