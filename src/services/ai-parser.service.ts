import { IShipment } from '../utils/types/models.interface';
import { IShipmentPublic } from '../utils/types/utilities.interface';
import { CreateShipmentDto } from '../utils/dtos';
import ShipmentController from '../controllers/shipment.controller';
import axios from 'axios';
import { Request, Response } from 'express';

export default class AiParserService {
  public static async createParsedShipment(
    parsedShipment: CreateShipmentDto,
  ): Promise<IShipmentPublic> {
    console.log('Placeholder: Creating parsed shipment:', parsedShipment);
    // Retornamos un objeto vacío como placeholder
    return {} as IShipmentPublic;
  }

  public static async parseShipment(
    carrier: string,
    trackingId: string,
  ): Promise<IShipment> {
    console.log(
      `[DEBUG] Entering parseShipment with carrier: ${carrier}, trackingId: ${trackingId}`,
    );

    try {
      // Crear un objeto Request simulado
      const mockRequest = {
        params: { carrier, shipmentId: trackingId },
      } as unknown as Request;

      // Crear un objeto Response simulado
      const mockResponse = {
        json: (data: any) => data,
        status: () => ({ json: (data: any) => data }),
      } as unknown as Response;

      // Llamar al método del controlador directamente
      const shipment = await ShipmentController.getByCarrierAndId(
        mockRequest,
        mockResponse,
      );

      if (!shipment) {
        throw new Error(
          `Shipment not found for carrier ${carrier} and tracking ID ${trackingId}`,
        );
      }

      console.log('[DEBUG] Shipment data fetched:', shipment);

      console.log('[DEBUG] Sending request to shipment parser service');
      const response = await axios.post(
        'http://localhost:3003/shipment-parser/parse',
        shipment,
      );
      console.log(
        '[DEBUG] Shipment parser service response:',
        response.status,
        response.data,
      );

      if (response.status === 200) {
        console.log('[DEBUG] Returning parsed shipment data');
        return response.data as IShipment;
      } else {
        console.log('[DEBUG] Throwing error due to non-200 status');
        throw new Error(`Failed to parse shipment. Status: ${response.status}`);
      }
    } catch (error) {
      console.error('[DEBUG] Error in parseShipment:', error);
      throw error;
    }
  }

  public static async trainAiModel(): Promise<void> {
    console.log('Placeholder: Training AI model...');
  }
}
