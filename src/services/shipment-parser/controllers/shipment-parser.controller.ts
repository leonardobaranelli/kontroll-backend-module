import { Request, Response } from 'express';
import { parseShipment } from '../parsers/shipment-parser';

export default class ShipmentParserController {
  public static async parse(req: Request, res: Response): Promise<void> {
    const shipmentData = req.body;

    try {
      const result = await parseShipment(shipmentData);

      if (!result.success) {
        throw new Error(result.error);
      }

      res.status(200).json(result.data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
