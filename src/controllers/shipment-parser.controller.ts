import { Request, Response } from 'express';
import ShipmentParserService from '../services/shipment-parser.service';

export default class ShipmentParserController {
  public static async parseShipment(req: Request, res: Response) {
    console.log('ShipmentParserController.parseShipment started');
    try {
      const shipmentData = req.body.input;
      const carrier = req.body.carrier;
      console.log('Request body:', JSON.stringify(req.body, null, 2));
      const parsedShipment = await ShipmentParserService.parseShipment(
        shipmentData,
        carrier,
        { useOpenAI: true },
      );
      console.log('Parsed shipment:', JSON.stringify(parsedShipment, null, 2));
      res.status(200).json(parsedShipment);
    } catch (error: any) {
      console.error(
        'Error in ShipmentParserController.parseShipment:',
        error.message,
      );
      console.error('Error stack:', error.stack);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }

  public static async parseShipmentWithMemory(req: Request, res: Response) {
    console.log('ShipmentParserController.parseShipmentWithMemory started');
    try {
      const shipmentData = req.body.input;
      const carrier = req.body.carrier;
      console.log('Request body:', JSON.stringify(req.body, null, 2));
      const parsedShipment = await ShipmentParserService.parseShipment(
        shipmentData,
        carrier,
        { useOpenAI: false },
      );
      console.log(
        'Parsed shipment with memory:',
        JSON.stringify(parsedShipment, null, 2),
      );
      res.status(200).json(parsedShipment);
    } catch (error: any) {
      console.error('Error in parseShipmentWithMemory:', error.message);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }

  public static async getMemoryShipments(res: Response) {
    try {
      const shipments = await ShipmentParserService.getMemoryShipments();
      res.status(200).json(shipments);
    } catch (error: any) {
      console.error('Error in getMemoryShipments:', error.message);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }

  public static async clearMemoryShipments(res: Response) {
    try {
      await ShipmentParserService.clearMemoryShipments();
      res.status(204).send();
    } catch (error: any) {
      console.error('Error in clearMemoryShipments:', error.message);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }
}
