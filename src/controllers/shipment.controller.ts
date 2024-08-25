import { Request, Response } from 'express';
import { plainToClass } from 'class-transformer';
import {
  sendSuccessResponse,
  sendErrorResponse,
} from './helpers/commons/handlers/responses.handler';
import { UpdateShipmentDto } from '../utils/dtos';
import ShipmentService from '../services/shipment.service';
import { IShipmentPublic } from '../utils/types/utilities.interface';
import { verifyEndpointRequest } from './helpers/shipment/verify-endpoint-request.helper';

export default class ShipmentController {
  //*#############################################*\\
  public static getShipment = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      verifyEndpointRequest(req, res, async () => {
        const {
          userId,
          carrierId,
          _companyId,
          token,
          transportMode,
          shipmentId,
        } = req.body as {
          userId: string;
          carrierId: string;
          token: string | null;
          transportMode: string | null;
          shipmentId: string;
          _companyId: string;
        };

        //const shipment: IShipmentPublic = await ShipmentService.getShipment(
        // const shipment = await ShipmentService.getShipment(
        //   userId,
        //   carrierId,
        //   _companyId,
        //   token,
        //   transportMode,
        //   shipmentId
        // );
        const shipment = await ShipmentService.getShipment(
          userId,
          carrierId,
          _companyId,
          token,
          transportMode,
          shipmentId,
        );
        sendSuccessResponse(res, shipment, 'Shipment successfully obtained.');
      });
    } catch (error: any) {
      sendErrorResponse(res, error);
    }
  };
  //*#############################################*//

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

  public static getByCarrier = async (
    _req: Request,
    res: Response,
  ): Promise<void> => {
    const { carrier } = _req.params;
    try {
      const shipments: IShipmentPublic[] =
        await ShipmentService.getShipmentsByCarrier(carrier);
      sendSuccessResponse(res, shipments, 'Shipments retrieved successfully');
    } catch (error: any) {
      sendErrorResponse(res, error, error.statusCode || 400);
    }
  };

  public static getByCarrierAndId = async (
    req: Request,
    res: Response,
  ): Promise<IShipmentPublic | null> => {
    const carrier = req.params.carrier as string;
    const shipmentId = req.params.shipmentId as string;

    try {
      const shipment: IShipmentPublic | null =
        await ShipmentService.getShipmentByCarrierAndId(carrier, shipmentId);
      sendSuccessResponse(
        res,
        shipment,
        `Shipment with id ${shipmentId} retrieved successfully`,
      );
      return shipment;
    } catch (error: any) {
      sendErrorResponse(res, error, error.statusCode || 400);
      return null;
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
