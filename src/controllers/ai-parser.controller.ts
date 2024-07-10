import { Request, Response } from 'express';
import { validateOrReject } from 'class-validator';
import { plainToClass } from 'class-transformer';
import {
  sendSuccessResponse,
  sendErrorResponse,
} from './helpers/handlers/responses.handler';
import { CreateShipmentDto } from '../utils/dtos';
import AiParserService from '../services/ai-parser.service';
import { isErrorArray } from './helpers/is-error-array.helper';
import { IShipmentPublic } from '../utils/types/utilities.interface';
import { IShipment } from '@/utils/types/models.interface';

export default class AiParserController {
  public static parseAndCreate = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const shipmentData: object = req.body;

    try {
      // Parse shipment data using AI service
      const parsedShipment: IShipment | null =
        await AiParserService.parseShipment(shipmentData);

      if (!parsedShipment) {
        throw new Error('Failed to parse shipment data');
      }

      // Convert parsed shipment data to DTO
      const createShipmentDto = plainToClass(CreateShipmentDto, parsedShipment);
      await validateOrReject(createShipmentDto);

      // Create the shipment using the DTO
      const newShipment: IShipmentPublic | null =
        await AiParserService.createParsedShipment(createShipmentDto);

      sendSuccessResponse(
        res,
        newShipment,
        'Shipment parsed and created successfully',
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

  public static trainAndCreate = async (
    _req: Request,
    res: Response,
  ): Promise<void> => {
    console.log('Retrain AI model and create shipment');
    AiParserService.trainAiModel();
    sendSuccessResponse(res, null, 'AI model retrained', 200);
  };
}
