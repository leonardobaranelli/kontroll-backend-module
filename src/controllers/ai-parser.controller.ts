import { Request, Response } from 'express';
import {
  sendSuccessResponse,
  sendErrorResponse,
} from './helpers/commons/handlers/responses.handler';
import AiParserService from '../services/ai-parser.service';
import { IShipmentPublic } from '../utils/types/utilities.interface';
import { IShipment } from '@/utils/types/models.interface';

export default class AiParserController {
  public static parseAndCreate = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const shipmentData: object = req.body;

    try {
      console.log('Placeholder: Parsing and creating shipment:', shipmentData);

      // Placeholder response
      const placeholderShipment: IShipmentPublic = {
        HousebillNumber: 'placeholder-housebill-number',
        // Add other required fields with placeholder values
      };

      sendSuccessResponse(
        res,
        placeholderShipment,
        'Placeholder: Shipment parsed and created successfully',
        201,
      );
    } catch (error: any) {
      sendErrorResponse(
        res,
        new Error('Placeholder: Error parsing and creating shipment'),
      );
    }
  };
  public static parseShipment = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const { carrier, trackingId } = req.params;
    try {
      const parsedShipment: IShipment = await AiParserService.parseShipment(
        carrier,
        trackingId,
      );
      sendSuccessResponse(res, parsedShipment, 'Shipment parsed successfully');
    } catch (error: any) {
      sendErrorResponse(res, error);
    }
  };

  public static parseShipmentWithMemory = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const { carrier, trackingId } = req.params;
    try {
      const parsedShipment: IShipment =
        await AiParserService.memoryParseShipment(carrier, trackingId);
      sendSuccessResponse(res, parsedShipment, 'Shipment parsed successfully');
    } catch (error: any) {
      sendErrorResponse(res, error);
    }
  };
}
