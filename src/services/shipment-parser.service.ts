import { IShipment } from '../utils/types/models.interface';
import { IError } from '../utils/types/utilities.interface';
import {
  ShipmentInput,
  ParserResult,
  ParserOptions,
} from '../utils/types/utilities.interface';
import { parseShipmentData } from '../core/shipment-parser/parser';
import { parseShipmentWithMemory } from '../core/shipment-parser/memory-parser';
import { formatShipmentData } from '../core/shipment-parser/utils/formattingUtils';

export default class ShipmentParserService {
  private static memoryShipments: IShipment[] = [];

  public static async parseShipment(
    input: ShipmentInput,
    carrier: string,
    options: ParserOptions = { useOpenAI: true },
  ): Promise<ParserResult> {
    try {
      let parserResult: ParserResult;
      console.log('Use OpenAI: ', options.useOpenAI);
      if (options.useOpenAI) {
        parserResult = await parseShipmentData(input, carrier, options);
      } else {
        parserResult = await parseShipmentWithMemory(input, carrier);
      }

      if (!parserResult.success) {
        return parserResult;
      }

      if (!parserResult.data) {
        return { success: false, error: 'Parser result data is undefined' };
      }
      const formattedShipment = formatShipmentData(parserResult.data);

      this.memoryShipments.push(formattedShipment);

      return {
        success: true,
        data: formattedShipment,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  public static async getMemoryShipments(): Promise<IShipment[]> {
    if (this.memoryShipments.length === 0) {
      const error: IError = {
        name: 'NotFoundError',
        message: 'There are no parsed shipments available',
        statusCode: 404,
      };
      throw error;
    }
    return this.memoryShipments;
  }

  public static clearMemoryShipments(): void {
    this.memoryShipments = [];
  }

  public static async getShipmentByHousebillNumber(
    housebillNumber: string,
  ): Promise<IShipment | null> {
    const shipment = this.memoryShipments.find(
      (s) => s.HousebillNumber === housebillNumber,
    );
    if (!shipment) {
      const error: IError = {
        name: 'NotFoundError',
        message: `No shipment found with HousebillNumber: ${housebillNumber}`,
        statusCode: 404,
      };
      throw error;
    }
    return shipment;
  }
}
