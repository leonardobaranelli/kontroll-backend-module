import Express from 'express';
import ConnectorController from '../controllers/connector.controller';

const router = Express.Router();

//GET
router.get('/', ConnectorController.getAll);
router.get('/type/:type', ConnectorController.getByType);
router.get('/id/:id', ConnectorController.getById);

//POST
router.post('/', ConnectorController.create);

//PUT
router.put('/type/:type', ConnectorController.updateByType);
router.put('/id/:id', ConnectorController.updateById);

//DELETE
router.delete('/all', ConnectorController.deleteAll);
router.delete('/type/:type', ConnectorController.deleteByType);
router.delete('/id/:id', ConnectorController.deleteById);

export default router;
