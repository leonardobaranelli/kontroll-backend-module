import { IShipment } from '../utils/types/models.interface';
import { IError } from '../utils/types/utilities.interface';
import {
  ShipmentInput,
  ParserResult,
  ParserOptions,
} from '../utils/types/shipment-parser.interface';
import { parseShipmentData } from '../utils/shipment-parser/parser';
import { parseShipment as parseShipmentWithMemory } from '../utils/shipment-parser/memory-parser';
import { validateShipmentData } from '../utils/shipment-parser/validator';
import { formatShipmentData } from '../utils/shipment-parser/formatter';

export default class ShipmentParserService {
  private static memoryShipments: IShipment[] = [];

  public static async parseShipment(
    input: ShipmentInput,
    options: ParserOptions = { useOpenAI: true },
  ): Promise<ParserResult> {
    try {
      let parserResult: ParserResult;

      if (options.useOpenAI) {
        parserResult = await parseShipmentData(input, options);
      } else {
        parserResult = await parseShipmentWithMemory(input);
      }

      if (!parserResult.success) {
        return parserResult;
      }

      if (!parserResult.data) {
        return { success: false, error: 'Parser result data is undefined' };
      }
      const validatedData = validateShipmentData(parserResult.data);
      const formattedShipment = formatShipmentData(validatedData);

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
