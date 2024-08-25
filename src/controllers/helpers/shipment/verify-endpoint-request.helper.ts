import { Request, Response, NextFunction } from 'express';

export const verifyEndpointRequest = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { userId, carrierId, shipmentId } = req.body as {
    userId: string;
    carrierId: string;
    shipmentId: string;
  };

  try {
    validate(userId, carrierId, shipmentId);
    next();
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

function validate(userId: string, carrierId: string, shipmentId: string): void {
  for (const [key, value] of Object.entries({
    userId,
    carrierId,
    shipmentId,
  })) {
    if (!value) {
      throw new Error(`${key} is required`);
    }
    if (typeof value !== 'string') {
      throw new Error(`${key} must be a string`);
    }
  }
}
