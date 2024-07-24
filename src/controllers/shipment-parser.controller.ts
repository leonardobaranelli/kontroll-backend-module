import { Request, Response, NextFunction } from 'express';
import ShipmentParserService from '../services/shipment-parser-service';

export default class ShipmentParserController {
  public static async parseShipment(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const shipmentData = req.body;
      const parsedShipment = await ShipmentParserService.parseShipment(
        shipmentData,
        { useOpenAI: true },
      );
      res.status(200).json(parsedShipment);
    } catch (error) {
      next(error);
    }
  }

  public static async parseShipmentWithMemory(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const shipmentData = req.body;
      const parsedShipment = await ShipmentParserService.parseShipment(
        shipmentData,
        { useOpenAI: false },
      );
      res.status(200).json(parsedShipment);
    } catch (error) {
      next(error);
    }
  }

  public static async getMemoryShipments(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const shipments = await ShipmentParserService.getMemoryShipments();
      res.status(200).json(shipments);
    } catch (error) {
      next(error);
    }
  }

  public static async clearMemoryShipments(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      await ShipmentParserService.clearMemoryShipments();
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
