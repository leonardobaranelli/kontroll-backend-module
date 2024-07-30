import { IShipment } from '../utils/types/models.interface';
import { IShipmentPublic } from '../utils/types/utilities.interface';
import { CreateShipmentDto } from '../utils/dtos';

export default class AiParserService {
  public static async createParsedShipment(
    parsedShipment: CreateShipmentDto,
  ): Promise<IShipmentPublic> {
    console.log('Placeholder: Creating parsed shipment:', parsedShipment);
    // Retornamos un objeto vacío como placeholder
    return {} as IShipmentPublic;
  }

  public static async parseShipment(shipmentData: any): Promise<IShipment> {
    console.log('Placeholder: Parsing shipment data:', shipmentData);
    // Retornamos un objeto vacío como placeholder
    return {} as IShipment;
  }

  public static async trainAiModel(): Promise<void> {
    console.log('Placeholder: Training AI model...');
  }
}
