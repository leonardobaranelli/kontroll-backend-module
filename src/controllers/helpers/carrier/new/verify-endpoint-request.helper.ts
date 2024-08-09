import { Request, Response, NextFunction } from 'express';

export const verifyEndpointRequest = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { name, shipmentId, endpoints } = req.body as {
    name: string;
    shipmentId: string;
    endpoints: Array<object>;
  };

  try {
    validate(name, shipmentId, endpoints);
    next();
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

function validate(
  name: string,
  shipmentId: string,
  endpoints: Array<object>,
): void {
  if (!name) {
    throw new Error('Name of your carrier is required');
  }
  if (!shipmentId) {
    throw new Error('Shipment ID is required');
  }
  if (!endpoints) {
    throw new Error('At leaste one endpoint is required');
  }
  if (typeof name !== 'string') {
    throw new Error('Name must be a string');
  }
  if (typeof shipmentId !== 'string') {
    throw new Error('Shipment ID must be a string');
  }
}
