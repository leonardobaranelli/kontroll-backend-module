/* import { Request, Response } from 'express';
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
    let shipmentData: CreateShipmentDto = plainToClass(
      CreateShipmentDto,
      req.body,
    ) as CreateShipmentDto;

    try {
      await validateOrReject(shipmentData);

      // Attempt to format and parse the shipment data using the AI service
      const parsedShipment: IShipment =
        await AiParserService.formatAndParseShipment(shipmentData);
      if (parsedShipment) {
        shipmentData = parsedShipment;
      }

      const newShipment: IShipmentPublic | null =
        await AiParserService.createParsedShipment(shipmentData);
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

  public static trainAndCreate = async () => {
    console.log('Retrain AI model and create shipment');
  };
}
*/
