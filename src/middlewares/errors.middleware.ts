import { Request, Response, NextFunction } from 'express';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import { IError } from '../utils/types/utilities.interface';

const allExceptionsFilter = new AllExceptionsFilter();

// Main errors handler
export const handleError = (
  err: IError,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  allExceptionsFilter.catch(err, req, res, next);
};

// "Not Found" error handler
export const handleNotFound = (
  _req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const error = new Error('Not Found');
  res.status(404).json({ message: error.message });
  next(error);
};
