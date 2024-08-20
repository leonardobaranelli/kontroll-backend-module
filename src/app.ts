import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import logger from 'morgan';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import { handleError, handleNotFound } from './middlewares/errors.middleware';
import routerSetup from './routes';

dotenv.config();

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'default-secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // true to HTTPS
  }),
);

routerSetup(app);

// Catch 404 and forward to error handler
app.use(handleNotFound);

// Error handler
app.use(handleError);

export default app;
