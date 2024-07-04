import Express from 'express';
import cors from 'cors';
import logger from 'morgan';
import mainRouter from './routes';
import { handleError, handleNotFound } from './middlewares/errors.middleware';

const app = Express();

app.use(cors());
app.use(logger('dev'));
app.use(Express.json());
app.use(mainRouter);

// Catch 404 and forward to error handler
app.use(handleNotFound);

// Error handler
app.use(handleError);

export default app;
