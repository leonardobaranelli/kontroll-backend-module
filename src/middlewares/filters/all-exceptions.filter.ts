import { Request, Response, NextFunction } from 'express';
import axios from 'axios';

// Catch and handle all exceptions
export class AllExceptionsFilter {
  catch(error: any, _req: Request, res: Response, _next: NextFunction) {
    const statusCode = error.statusCode || 500;
    const message = axios.isAxiosError(error)
      ? error.response?.statusText || 'Axios error occurred'
      : error.message || 'Unknown error';

    res.status(statusCode).json({ message });
    console.error(error);
  }
}
