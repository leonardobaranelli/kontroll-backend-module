import Express from 'express';
import usersRouter from './user.routes';

const mainRouter = Express.Router();

mainRouter.use('/users', usersRouter);

export default mainRouter;
