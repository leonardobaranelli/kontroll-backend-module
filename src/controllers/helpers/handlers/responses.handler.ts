import axios from 'axios';
import { Response } from 'express';
import { IError } from '../../../utils/types/utilities.interface';

// Send success response
export const sendSuccessResponse = (
  res: Response,
  data: any,
  message: string,
  statusCode: number = 200,
): void => {
  res.status(statusCode).json({ message, data });
};

// Send error response
export const sendErrorResponse = (
  res: Response,
  error: IError,
  statusCode: number = 400,
): void => {
  const message = axios.isAxiosError(error)
    ? error.response?.statusText
    : (error as Error).message || 'Unknown error';

  res.status(statusCode).json({ message });
};
