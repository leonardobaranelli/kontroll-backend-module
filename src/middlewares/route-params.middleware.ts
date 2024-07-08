import { Request, Response, NextFunction } from 'express';

// Check if userId parameter is present and not empty
export const checkIdParam = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const userId = req.params.id as string;
  if (!userId || userId.trim() === '') {
    res.status(400).json({
      error: 'Missing or empty userId parameter',
    });
  } else {
    next();
  }
};

// Check if username parameter is present and not empty
export const checkUsernameParam = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const username = req.params.username as string;
  if (!username || username.trim() === '') {
    res.status(400).json({
      error: 'Missing or empty username parameter',
    });
  } else {
    next();
  }
};
