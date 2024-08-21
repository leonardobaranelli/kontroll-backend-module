import { IShipment, IShipmentContent } from '../utils/types/models.interface';
import { ShipmentInput } from '../utils/types/utilities.interface';
import ParsingDictionaryService from './parsing-dictionary.service';
import ShipmentController from '../controllers/shipment.controller';
import { Request, Response } from 'express';
import { parseShipmentData } from '../core/shipment-parser/parser';
import { parseShipmentWithMemory } from '../core/shipment-parser/memory-parser';
import { getShipmentsCollection } from '../config/database/firestore/firestore.config';

export default class ShipmentParserService {
  private static memoryShipments: IShipmentContent[] = [];

  public static async parseShipmentEntry(
    carrier: string,
    shipmentData: string[],
  ): Promise<IShipment> {
    console.log('parseShipmentEntry started');
    try {
      const parsingDictionary =
        await ParsingDictionaryService.getParsingDictionaryByCarrier(carrier);

      let result;
      if (
        parsingDictionary?.dictionary &&
        Object.keys(parsingDictionary.dictionary).length > 0
      ) {
        result = await parseShipmentWithMemory(shipmentData, carrier);
      } else {
        result = await parseShipmentData(shipmentData, carrier, {
          useOpenAI: true,
        });
      }

      if (!result.success || !result.data) {
        throw new Error('Failed to parse shipment');
      }

      const shipment = this.convertToIShipment(result.data, carrier);
      this.memoryShipments.push(result.data);
      return shipment;
    } catch (error: any) {
      console.error('Error in parseShipmentEntry:', error);
      throw new Error(`Failed to parse shipment entry: ${error.message}`);
    }
  }

  public static async parseShipmentWithMemory(
    carrier: string,
    shipmentData: string[],
  ): Promise<IShipment> {
    console.log('parseShipmentWithMemory started', { carrier });
    try {
      const result = await parseShipmentWithMemory(shipmentData, carrier);
      if (!result.success || !result.data) {
        throw new Error('Failed to parse shipment with memory');
      }
      return this.convertToIShipment(result.data, carrier);
    } catch (error: any) {
      console.error('Error in parseShipmentWithMemory:', error);
      throw new Error(`Failed to parse shipment with Memory: ${error.message}`);
    }
  }

  public static async parseShipmentWithAI(
    carrier: string,
    shipmentData: string[],
  ): Promise<IShipment> {
    console.log('parseShipmentWithAI started');
    try {
      const result = await parseShipmentData(shipmentData, carrier, {
        useOpenAI: true,
      });
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to parse shipment with AI');
      }
      return this.convertToIShipment(result.data, carrier);
    } catch (error: any) {
      console.error('Error in parseShipmentWithAI:', error);
      throw new Error(`Failed to parse shipment with AI: ${error.message}`);
    }
  }

  public static async getShipmentFromController(
    carrier: string,
    trackingId: string,
  ): Promise<ShipmentInput> {
    const mockRequest = {
      params: { carrier, shipmentId: trackingId },
    } as unknown as Request;
    const mockResponse = {
      json: (data: any) => data,
      status: (statusCode: number) => ({
        json: (data: any) => ({ statusCode, ...data }),
      }),
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

    return shipment;
  }

  private static convertToIShipment(
    shipmentContent: IShipmentContent,
    carrier: string,
  ): IShipment {
    return {
      id: shipmentContent.HousebillNumber,
      carrierId: carrier,
      shipmentContent,
    };
  }

  public static async getShipmentByHousebillNumber(
    housebillNumber: string,
  ): Promise<IShipmentContent | null> {
    const shipment = this.memoryShipments.find(
      (s) => s.HousebillNumber === housebillNumber,
    );
    if (!shipment) {
      const error: Error = {
        name: 'NotFoundError',
        message: `No shipment found with HousebillNumber: ${housebillNumber}`,
      };
      throw error;
    }
    return shipment;
  }
  public static async saveParsedShipment(
    carrierId: string,
    housebillNumber: string,
  ): Promise<IShipmentContent | null> {
    console.log('memoryShipments:', this.memoryShipments);
    const shipment = this.memoryShipments.find(
      (s) => s.HousebillNumber === housebillNumber,
    );
    if (!shipment) {
      const error: Error = {
        name: 'NotFoundError',
        message: `No shipment found with HousebillNumber: ${housebillNumber}`,
      };
      throw error;
    }
    try {
      const shipmentsCollection = getShipmentsCollection();
      const newShipment = {
        id: shipment.HousebillNumber,
        carrierId: carrierId,
        shipmentContent: shipment,
      };
      await shipmentsCollection.add(newShipment);
      console.log('Shipment successfully saved to database');
    } catch (error) {
      console.log('Error saving shipment to database:', error);
    }
    return shipment;
  }
}
