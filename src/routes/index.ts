import Express from 'express';
import shipmentRouter from './shipment.routes';
import aiParserRouter from './ai-parser.routes';
import carrierRouter from './carrier.routes';
import shipmentParserRouter from './shipment-parser.routes';

const mainRouter = Express.Router();

mainRouter.use('/shipments', shipmentRouter);
mainRouter.use('/ai-parser', aiParserRouter);
mainRouter.use('/carriers', carrierRouter);
mainRouter.use('/shipment-parser', shipmentParserRouter);

export default mainRouter;
