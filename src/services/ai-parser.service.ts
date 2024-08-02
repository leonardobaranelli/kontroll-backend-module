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
    try {
      const mockRequest = {
        params: { carrier, shipmentId: trackingId },
      } as unknown as Request;

      const mockResponse = {
        json: (data: any) => data,
        status: () => ({ json: (data: any) => data }),
      } as unknown as Response;

      const shipment = await ShipmentController.getByCarrierAndId(
        mockRequest,
        mockResponse,
      );

      if (!shipment) {
        throw new Error(
          `Shipment not found for carrier ${carrier} and tracking ID ${trackingId}`,
        );
      }
      const response = await axios.post(
        'http://localhost:3001/shipment-parser/parse',
        shipment,
      );
      if (response.status === 200 && response.data.success) {
        return response.data.data as IShipment;
      } else {
        throw new Error(response.data.error || 'Failed to parse shipment');
      }
    } catch (error) {
      throw error;
    }
  }

  public static async memoryParseShipment(
    carrier: string,
    trackingId: string,
  ): Promise<IShipment> {
    try {
      const mockRequest = {
        params: { carrier, shipmentId: trackingId },
      } as unknown as Request;

      const mockResponse = {
        json: (data: any) => data,
        status: () => ({ json: (data: any) => data }),
      } as unknown as Response;

      const shipment = await ShipmentController.getByCarrierAndId(
        mockRequest,
        mockResponse,
      );

      if (!shipment) {
        throw new Error(
          `Shipment not found for carrier ${carrier} and tracking ID ${trackingId}`,
        );
      }
      const response = await axios.post(
        'http://localhost:3001/shipment-parser/memory-parse',
        shipment,
      );
      if (response.status === 200 && response.data.success) {
        return response.data.data as IShipment;
      } else {
        throw new Error(response.data.error || 'Failed to parse shipment');
      }
    } catch (error) {
      throw error;
    }
  }
}
