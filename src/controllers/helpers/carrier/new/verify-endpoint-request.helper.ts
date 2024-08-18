import { Request, Response, NextFunction } from 'express';

export const verifyEndpointRequest = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { name, shipmentId, endpoint } = req.body as {
    name: string;
    shipmentId: string;
    endpoint: object;
  };

  try {
    validate(name, shipmentId, endpoint);
    next();
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

function validate(name: string, shipmentId: string, endpoint: object): void {
  if (!name) {
    throw new Error('Name of your carrier is required');
  }
  if (!shipmentId) {
    throw new Error('Shipment ID is required');
  }
  if (!endpoint) {
    throw new Error('The endpoint is required');
  }
  if (typeof name !== 'string') {
    throw new Error('Name must be a string');
  }
  if (typeof shipmentId !== 'string') {
    throw new Error('Shipment ID must be a string');
  }
}
