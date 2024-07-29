import { Request, Response } from 'express';
import {
  sendSuccessResponse,
  sendErrorResponse,
} from './helpers/commons/handlers/responses.handler';
import ShipmentServiceFirebase from '../services/shipment-firebase.service';
import { IShipmentPublic } from '../utils/types/utilities.interface';

export default class ShipmentControllerFirebase {
  public static getByCarrier = async (
    _req: Request,
    res: Response,
  ): Promise<void> => {
    const { carrier } = _req.params;
    try {
      const shipments: IShipmentPublic[] =
        await ShipmentServiceFirebase.getShipmentsByCarrier(carrier);
      sendSuccessResponse(res, shipments, 'Shipments retrieved successfully');
    } catch (error: any) {
      sendErrorResponse(res, error, error.statusCode || 400);
    }
  };

  public static getByCarrierAndId = async (
    _req: Request,
    res: Response,
  ): Promise<void> => {
    const { carrier, id } = _req.params;
    try {
      const shipment: IShipmentPublic =
        await ShipmentServiceFirebase.getShipmentByCarrierAndId(carrier, id);
      sendSuccessResponse(res, shipment, 'Shipment retrieved successfully');
    } catch (error: any) {
      sendErrorResponse(res, error, error.statusCode || 400);
    }
  };
}
