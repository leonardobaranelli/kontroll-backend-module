import { IShipment } from '../utils/types/models.interface';
import { IShipmentPublic } from '../utils/types/utilities.interface';
import ShipmentController from '../controllers/shipment.controller';
import axios from 'axios';
import { Request, Response } from 'express';
import ParsingDictionaryService from '../services/parsing-dictionary.service';

export default class AiParserService {
  public static async createParsedShipment(): Promise<IShipmentPublic> {
    // Retornamos un objeto vacío como placeholder
    return {} as IShipmentPublic;
  }

  public static async parseShipment(
    carrier: string,
    trackingId: string,
  ): Promise<IShipment> {
    console.log('parseShipment started');
    try {
      const mockRequest = {
        params: { carrier, shipmentId: trackingId },
      } as unknown as Request;

      const mockResponse = {
        json: (data: any) => data,
        status: function (statusCode: number) {
          return {
            json: (data: any) => ({ statusCode, ...data }),
          };
        },
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
        { input: shipment, carrier: carrier },
        {
          timeout: 120000,
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
        },
      );

      if (response.status === 200 && response.data.success) {
        return response.data.data as IShipment;
      } else {
        throw new Error(response.data.error || 'Failed to parse shipment');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNRESET') {
          console.error(
            'Connection reset by the server. This might be due to a timeout or server crash.',
          );
        }
      }
      throw error;
    }
  }

  public static async memoryParseShipment(
    carrier: string,
    trackingId: string,
  ): Promise<IShipment> {
    console.log('memoryParseShipment started');
    try {
      const mockRequest = {
        params: { carrier, shipmentId: trackingId },
      } as unknown as Request;

      const mockResponse = {
        json: (data: any) => data,
        status: function (statusCode: number) {
          return {
            json: (data: any) => ({ statusCode, ...data }),
          };
        },
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

      console.log('Shipment fetched:', JSON.stringify(shipment, null, 2));

      const response = await axios.post(
        'http://localhost:3001/shipment-parser/memory-parse',
        { input: shipment, carrier: carrier },
      );

      console.log(
        'Response from memory-parse:',
        JSON.stringify(response.data, null, 2),
      );

      if (response.status === 200 && response.data.success) {
        return response.data.data as IShipment;
      } else {
        throw new Error(response.data.error || 'Failed to parse shipment');
      }
    } catch (error) {
      console.error('Error in memoryParseShipment:', error);
      throw error;
    }
  }

  public static async parseShipmentEntry(
    carrier: string,
    trackingId: string,
  ): Promise<IShipment> {
    console.log('parseShipmentEntry started');
    try {
      const parsingDictionary =
        await ParsingDictionaryService.getParsingDictionaryByCarrier(carrier);

      if (
        parsingDictionary &&
        parsingDictionary.dictionary &&
        Object.keys(parsingDictionary.dictionary).length > 0
      ) {
        return await this.memoryParseShipment(carrier, trackingId);
      } else {
        return await this.parseShipment(carrier, trackingId);
      }
    } catch (error) {
      console.error('Error in parseShipmentEntry:', error);
      throw error;
    }
  }
}
