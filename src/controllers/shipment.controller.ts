import { Request, Response } from 'express';
import { validateOrReject } from 'class-validator';
import { plainToClass } from 'class-transformer';
import {
  sendSuccessResponse,
  sendErrorResponse,
} from './helpers/commons/handlers/responses.handler';
import { CreateShipmentDto, UpdateShipmentDto } from '../utils/dtos';
import ShipmentService from '../services/shipment.service';
import { isErrorArray } from './helpers/commons/is-error-array.helper';
import { IShipmentPublic } from '../utils/types/utilities.interface';

export default class ShipmentController {
  public static getAll = async (
    _req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const shipments: IShipmentPublic[] =
        await ShipmentService.getAllShipments();
      sendSuccessResponse(res, shipments, 'Shipments retrieved successfully');
    } catch (error: any) {
      sendErrorResponse(res, error, error.statusCode || 400);
    }
  };

  public static getByNumber = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const HousebillNumber = req.params.HousebillNumber as string;

    try {
      const shipment: IShipmentPublic | null =
        await ShipmentService.getShipmentByNumber(HousebillNumber);
      sendSuccessResponse(
        res,
        shipment,
        `Shipment with name ${HousebillNumber} retrieved successfully`,
      );
    } catch (error: any) {
      sendErrorResponse(res, error, error.statusCode || 400);
    }
  };

  public static create = async (req: Request, res: Response): Promise<void> => {
    let shipmentData: CreateShipmentDto = plainToClass(
      CreateShipmentDto,
      req.body,
    ) as CreateShipmentDto;

    try {
      await validateOrReject(shipmentData);

      const newShipment: IShipmentPublic | null =
        await ShipmentService.createShipment(shipmentData);
      sendSuccessResponse(
        res,
        newShipment,
        'Shipment created successfully',
        201,
      );
    } catch (error: any) {
      if (isErrorArray(error)) {
        const errorMessage: string = error
          .map((err) => Object.values(err.constraints || {}))
          .join(', ');
        sendErrorResponse(res, new Error(errorMessage));
      } else {
        sendErrorResponse(res, error as Error);
      }
    }
  };

  public static updateByNumber = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const HousebillNumber = req.params.HousebillNumber as string;
    const newData: UpdateShipmentDto = plainToClass(
      UpdateShipmentDto,
      req.body,
    ) as UpdateShipmentDto;

    try {
      const updatedShipment: IShipmentPublic | null =
        await ShipmentService.updateShipmentByNumber(HousebillNumber, newData);
      sendSuccessResponse(
        res,
        updatedShipment,
        `Shipment with name ${HousebillNumber} updated successfully`,
      );
    } catch (error: any) {
      sendErrorResponse(res, error, error.statusCode || 400);
    }
  };

  public static deleteAll = async (
    _req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      await ShipmentService.deleteAllShipments();
      sendSuccessResponse(res, null, 'All shipments deleted successfully');
    } catch (error: any) {
      sendErrorResponse(res, error, error.statusCode || 400);
    }
  };

  public static deleteByNumber = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const HousebillNumber: string = req.params.HousebillNumber;

    try {
      await ShipmentService.deleteShipmentByNumber(HousebillNumber);
      sendSuccessResponse(
        res,
        null,
        `Shipments with name ${HousebillNumber} deleted successfully`,
      );
    } catch (error: any) {
      sendErrorResponse(res, error, error.statusCode || 400);
    }
  };
}
