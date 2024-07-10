/* import { Shipment } from '../models/shipment.model';
import { CreateShipmentDto } from '../utils/dtos';
import { IShipment } from '../utils/types/models.interface';
import {
  IShipmentPublic,
  AbstractShipmentPublic,
  IError,
} from '../utils/types/utilities.interface';
import { getAttributes } from './helpers/get-attributes.helper';
import axios from 'axios';
import formatData from './helpers/ai-parser/set-data.helper';

export default class AiParserService {
  public static async createParsedShipment(
    shipmentData: CreateShipmentDto,
  ): Promise<IShipmentPublic> {
    const { trackingNumber, name } = shipmentData;

    try {
      const existingShipment: IShipmentPublic | null = await Shipment.findOne({
        where: { trackingNumber },
        attributes: getAttributes(AbstractShipmentPublic),
      });

      if (existingShipment) {
        const error: IError = new Error(
          `Shipment with tracking number ${trackingNumber} already exists`,
        );
        error.statusCode = 409;
        throw error;
      }

      shipmentData.name =
        name !== undefined && name !== null
          ? name
          : `undefined_name_${Date.now()}`;

      const newShipment: IShipmentPublic = await Shipment.create(shipmentData);
      return newShipment;
    } catch (error) {
      throw error;
    }
  }

  public static async formatAndParseShipment(shipmentData: any): Promise<any> {
    try {
      const formattedData: object = await formatData(shipmentData);

      console.log('Parsing data...');
      const response = await axios.post<object>(
        'http://localhost:5000/add_shipment',
        formattedData,
      );

      return response.data as IShipment;
    } catch (error) {
      console.error('Error in AI parsing process: ', error);
      throw error;
    }
  }

  // Retrain the AI model
  public static async trainAiModel(): Promise<any> {
    try {
      console.log('Training model...');
    } catch (error) {
      console.error('Error in AI training process: ', error);
      throw error;
    }
  }
}

*/
