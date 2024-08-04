import { Request, Response, NextFunction } from 'express';

export const verifyStepRequest = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { step, data } = req.body as {
    step: string;
    data: any;
  };

  try {
    if (step == 'step1') validateNameOnStep1(data);
    next();
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

function validateNameOnStep1(data: any): void {
  if (!data.name) {
    throw new Error('Name is required for this step');
  }
  if (typeof data.name !== 'string') {
    throw new Error('Name must be a string');
  }
}
