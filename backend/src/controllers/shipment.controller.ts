import { Request, Response } from 'express';
import { validateOrReject } from 'class-validator';
import { plainToClass } from 'class-transformer';
import {
  sendSuccessResponse,
  sendErrorResponse,
} from './helpers/handlers/responses.handler';
import { CreateShipmentDto, UpdateShipmentDto } from '../utils/dtos';
import ShipmentService from '../services/shipment.service';
import { isErrorArray } from './helpers/is-error-array.helper';
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

  public static getByName = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const name = req.params.name as string;

    try {
      const shipment: IShipmentPublic | null =
        await ShipmentService.getShipmentByName(name);
      sendSuccessResponse(
        res,
        shipment,
        `Shipment with name ${name} retrieved successfully`,
      );
    } catch (error: any) {
      sendErrorResponse(res, error, error.statusCode || 400);
    }
  };

  public static getByTrackingNumber = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const trackingNumber = req.params.trackingNumber as string;

    try {
      const shipment: IShipmentPublic | null =
        await ShipmentService.getShipmentByTrackingNumber(trackingNumber);
      sendSuccessResponse(
        res,
        shipment,
        'Shipment retrieved successfully by tracking number',
      );
    } catch (error: any) {
      sendErrorResponse(res, error, error.statusCode || 400);
    }
  };

  public static getById = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const shipmentId = req.params.id as string;

    try {
      const shipment: IShipmentPublic | null =
        await ShipmentService.getShipmentById(shipmentId);
      sendSuccessResponse(res, shipment, 'Shipment retrieved successfully');
    } catch (error: any) {
      sendErrorResponse(res, error, error.statusCode || 400);
    }
  };

  public static create = async (req: Request, res: Response): Promise<void> => {
    const shipmentData: CreateShipmentDto = plainToClass(
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

  public static updateByName = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const shipmentName = req.params.name as string;
    const newData: UpdateShipmentDto = plainToClass(
      UpdateShipmentDto,
      req.body,
    ) as UpdateShipmentDto;

    try {
      const updatedShipment: IShipmentPublic | null =
        await ShipmentService.updateShipmentByName(shipmentName, newData);
      sendSuccessResponse(
        res,
        updatedShipment,
        `Shipment with name ${shipmentName} updated successfully`,
      );
    } catch (error: any) {
      sendErrorResponse(res, error, error.statusCode || 400);
    }
  };

  public static updateById = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const shipmentId = req.params.id as string;
    const newData: UpdateShipmentDto = plainToClass(
      UpdateShipmentDto,
      req.body,
    ) as UpdateShipmentDto;

    try {
      const updatedShipment: IShipmentPublic | null =
        await ShipmentService.updateShipmentById(shipmentId, newData);
      sendSuccessResponse(
        res,
        updatedShipment,
        `Shipment with ID ${shipmentId} updated successfully`,
      );
    } catch (error: any) {
      sendErrorResponse(res, error, error.statusCode || 400);
    }
  };

  public static updateByTrackingNumber = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const trackingNumber = req.params.trackingNumber as string;
    const newData: UpdateShipmentDto = plainToClass(
      UpdateShipmentDto,
      req.body,
    ) as UpdateShipmentDto;

    try {
      const updatedShipment: IShipmentPublic | null =
        await ShipmentService.updateShipmentByTrackingNumber(
          trackingNumber,
          newData,
        );
      sendSuccessResponse(
        res,
        updatedShipment,
        `Shipment with tracking number ${trackingNumber} updated successfully`,
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

  public static deleteByName = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const name: string = req.params.name;

    try {
      await ShipmentService.deleteShipmentByName(name);
      sendSuccessResponse(
        res,
        null,
        `Shipments with name ${name} deleted successfully`,
      );
    } catch (error: any) {
      sendErrorResponse(res, error, error.statusCode || 400);
    }
  };

  public static deleteByTrackingNumber = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const trackingNumber: string = req.params.trackingNumber;

    try {
      await ShipmentService.deleteShipmentByTrackingNumber(trackingNumber);
      sendSuccessResponse(
        res,
        null,
        `Shipment with tracking number ${trackingNumber} deleted successfully`,
      );
    } catch (error: any) {
      sendErrorResponse(res, error, error.statusCode || 400);
    }
  };

  public static deleteById = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const shipmentId: string = req.params.id;

    try {
      await ShipmentService.deleteShipmentById(shipmentId);
      sendSuccessResponse(
        res,
        null,
        `Shipment with ID ${shipmentId} deleted successfully`,
      );
    } catch (error: any) {
      sendErrorResponse(res, error, error.statusCode || 400);
    }
  };
}
