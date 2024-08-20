import Express from 'express';
import shipmentRouter from './shipment.routes';
import carrierRouter from './carrier.routes';
import shipmentParserRouter from './shipment-parser.routes';
import parsingDictionaryRouter from './parsing-dictionary.routes';

const mainRouter = Express.Router();

mainRouter.use('/shipments', shipmentRouter);
mainRouter.use('/carriers', carrierRouter);
mainRouter.use('/shipment-parser', shipmentParserRouter);
mainRouter.use('/parsing-dictionary', parsingDictionaryRouter);

const routerSetup = (app: Express.Application) => {
  app.use(mainRouter);
};
export default routerSetup;
