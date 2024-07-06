import Express from 'express';
import userRouter from './user.routes';
import connectorRouter from './connector.routes';
import shipmentRouter from './shipment.routes';

const mainRouter = Express.Router();

mainRouter.use('/users', userRouter);
mainRouter.use('/connectors', connectorRouter);
mainRouter.use('/shipments', shipmentRouter);

export default mainRouter;
