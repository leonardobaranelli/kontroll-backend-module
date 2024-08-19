import { Request, Response } from 'express';
import ShipmentParserService from '../services/shipment-parser.service';
import {
  sendSuccessResponse,
  sendErrorResponse,
} from './helpers/commons/handlers/responses.handler';
import { generateMechanicalMapping } from '../core/shipment-parser/utils/mappingUtils';

export default class ShipmentParserController {
  public static async parseShipmentEntry(req: Request, res: Response) {
    console.log('ShipmentParserController.parseShipmentEntry started');
    try {
      const { carrier, trackingId } = req.params;
      const parsedShipment = await ShipmentParserService.parseShipmentEntry(
        carrier,
        trackingId,
      );
      sendSuccessResponse(res, parsedShipment, 'Shipment parsed successfully');
    } catch (error: any) {
      console.error('Error in parseShipmentEntry:', error.message);
      sendErrorResponse(res, error);
    }
  }

  public static async parseShipmentWithAI(req: Request, res: Response) {
    console.log('ShipmentParserController.parseShipmentWithAI started');
    try {
      const { carrier, trackingId } = req.params;
      const parsedShipment = await ShipmentParserService.parseShipmentWithAI(
        carrier,
        trackingId,
      );
      sendSuccessResponse(
        res,
        parsedShipment,
        'Shipment parsed successfully with AI',
      );
    } catch (error: any) {
      console.error('Error in parseShipmentWithAI:', error.message);
      sendErrorResponse(res, error);
    }
  }

  public static async parseShipmentWithMemory(req: Request, res: Response) {
    console.log('ShipmentParserController.parseShipmentWithMemory started');
    try {
      const { carrier, trackingId } = req.params;
      const parsedShipment =
        await ShipmentParserService.parseShipmentWithMemory(
          carrier,
          trackingId,
        );
      sendSuccessResponse(
        res,
        parsedShipment,
        'Shipment parsed successfully with memory',
      );
    } catch (error: any) {
      console.error('Error in parseShipmentWithMemory:', error.message);
      sendErrorResponse(res, error);
    }
  }
  public static async saveParsedShipment(req: Request, res: Response) {
    try {
      const { carrierId, housebillNumber } = req.params;
      const parsedShipment = await ShipmentParserService.saveParsedShipment(
        carrierId,
        housebillNumber,
      );
      sendSuccessResponse(
        res,
        parsedShipment,
        'Shipment succesfully saved in database',
      );
    } catch (error: any) {
      sendErrorResponse(res, error);
    }
  }

  public static async testMechanicalParser(req: Request, res: Response) {
    console.log('ShipmentParserController.testMechanicalParser started');
    try {
      const { input, output } = req.body;
      if (!input || !output) {
        throw new Error('Both input and output JSONs are required');
      }
      const mappingDictionary = generateMechanicalMapping(input, output);
      sendSuccessResponse(
        res,
        mappingDictionary,
        'Mechanical parsing completed successfully',
      );
    } catch (error: any) {
      console.error('Error in testMechanicalParser:', error.message);
      sendErrorResponse(res, error);
    }
  }
}
