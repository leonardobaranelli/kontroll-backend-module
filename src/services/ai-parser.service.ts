import { Shipment } from '../models/shipment.model';
import { CreateShipmentDto } from '../utils/dtos';
import { IShipment } from '../utils/types/models.interface';
import { IShipmentPublic } from '../utils/types/utilities.interface';
import axios from 'axios';
import setData from './helpers/ai-parser/set-data.helper';

export default class AiParserService {
  public static async createParsedShipment(
    parsedShipment: CreateShipmentDto,
  ): Promise<IShipmentPublic> {
    try {
      const newShipment: Shipment = await Shipment.create(parsedShipment);
      return newShipment as IShipmentPublic;
    } catch (error) {
      console.error('Error creating parsed shipment: ', error);
      throw error;
    }
  }

  public static async parseShipment(shipmentData: any): Promise<IShipment> {
    try {
      const formattedData: object = await setData(shipmentData);

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

  public static async trainAiModel(): Promise<void> {
    try {
      console.log('Training model...');
    } catch (error) {
      console.error('Error in AI training process: ', error);
      throw error;
    }
  }
}
