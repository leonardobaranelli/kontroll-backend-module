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

  public static trainAndCreate = async (
    _req: Request,
    res: Response,
  ): Promise<void> => {
    console.log('Retrain AI model and create shipment');
    AiParserService.trainAiModel();
    sendSuccessResponse(res, null, 'AI model retrained', 200);
  };

  public static parseShipment = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    console.log('[DEBUG] Entering AiParserController.parseShipment');
    const { carrier, trackingId } = req.params;
    console.log(`[DEBUG] Params: carrier=${carrier}, trackingId=${trackingId}`);

    try {
      console.log('[DEBUG] Calling AiParserService.parseShipment');
      const parsedShipment: IShipment = await AiParserService.parseShipment(
        carrier,
        trackingId,
      );
      console.log('[DEBUG] Parsed shipment:', parsedShipment);
      console.log('[DEBUG] Sending success response');
      sendSuccessResponse(res, parsedShipment, 'Shipment parsed successfully');
    } catch (error: any) {
      console.error(
        '[DEBUG] Error in AiParserController.parseShipment:',
        error,
      );
      console.log('[DEBUG] Sending error response');
      sendErrorResponse(res, error, error.statusCode || 500);
    }
    console.log('[DEBUG] Exiting AiParserController.parseShipment');
  };
}
