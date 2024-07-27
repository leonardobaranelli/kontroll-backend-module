import { Shipment } from '../models/shipment.model';
import { CreateShipmentDto, UpdateShipmentDto } from '../utils/dtos';
import {
  IShipmentPublic,
  AbstractShipmentPublic,
  IError,
} from '../utils/types/utilities.interface';
import { getAttributes } from './helpers/commons/get-attributes.helper';

export default class ShipmentService {
  public static async getAllShipments(): Promise<IShipmentPublic[]> {
    try {
      const allShipments: IShipmentPublic[] = await Shipment.findAll({
        attributes: getAttributes(AbstractShipmentPublic),
      });

      if (allShipments.length === 0) {
        const error: IError = new Error('There are no shipments available');
        error.statusCode = 404;
        throw error;
      }
      return allShipments;
    } catch (error) {
      throw error;
    }
  }

  public static async getShipmentByNumber(
    HousebillNumber: string,
  ): Promise<IShipmentPublic> {
    try {
      const shipment: IShipmentPublic | null = await Shipment.findOne({
        where: { HousebillNumber },
        attributes: getAttributes(AbstractShipmentPublic),
      });

      if (!shipment) {
        const error: IError = new Error(
          `Shipment with number ${HousebillNumber} not found`,
        );
        error.statusCode = 404;
        throw error;
      }
      return shipment;
    } catch (error) {
      throw error;
    }
  }

  public static async createShipment(
    shipmentData: CreateShipmentDto
  ): Promise<IShipmentPublic> {
    const { HousebillNumber } = shipmentData;

    try {
      // Aquí deberíamos buscar el envío en los conectores
      const existingShipment = await this.searchShipmentInConnectors(HousebillNumber);

      if (existingShipment) {
        const error: IError = new Error(
          `Shipment with tracking number ${HousebillNumber} already exists`
        );
        error.statusCode = 409;
        throw error;
      }

      // Aquí deberíamos crear el envío en el conector apropiado
      const newShipment = await this.createShipmentInConnector(shipmentData);

      // Convertir el resultado del conector a IShipmentPublic
      const publicShipment: IShipmentPublic = this.convertToPublicShipment(newShipment);

      return publicShipment;
    } catch (error) {
      throw error;
    }
  }

  private static async searchShipmentInConnectors(HousebillNumber: string): Promise<any> {
    // Implementar la lógica para buscar en los conectores
    // Por ahora, retornamos null como placeholder
    console.log('Buscando envío en conectores... a ' + HousebillNumber);
    return null;
  }

  private static async createShipmentInConnector(shipmentData: CreateShipmentDto): Promise<any> {
    // Implementar la lógica para crear el envío en el conector apropiado
    // Por ahora, retornamos los datos recibidos como placeholder
    return shipmentData;
  }

  private static convertToPublicShipment(shipmentData: any): IShipmentPublic {
    // Implementar la lógica para convertir los datos del conector a IShipmentPublic
    // Por ahora, hacemos un cast simple
    return shipmentData as IShipmentPublic;
  }

  public static async updateShipmentByNumber(
    HousebillNumber: string,
    newData: UpdateShipmentDto,
  ): Promise<IShipmentPublic> {
    try {
      const [updatedRows]: [number] = await Shipment.update(newData, {
        where: { HousebillNumber },
      });

      if (updatedRows === 0) {
        const error: IError = new Error(
          `Shipment with number ${HousebillNumber} not found`,
        );
        error.statusCode = 404;
        throw error;
      }

      const updatedShipment: IShipmentPublic | null = await Shipment.findOne({
        where: { HousebillNumber },
        attributes: getAttributes(AbstractShipmentPublic),
      });

      return updatedShipment as IShipmentPublic;
    } catch (error) {
      throw error;
    }
  }

  public static async deleteAllShipments(): Promise<void> {
    try {
      await Shipment.destroy({ where: {} });
    } catch (error) {
      throw error;
    }
  }

  public static async deleteShipmentByNumber(
    HousebillNumber: string,
  ): Promise<void> {
    try {
      const shipments: Shipment[] | null = await Shipment.findAll({
        where: { HousebillNumber },
      });
      if (shipments.length === 0) {
        throw new Error(`No shipments with number ${HousebillNumber} found`);
      }
      await Shipment.destroy({ where: { HousebillNumber } });
    } catch (error) {
      throw error;
    }
  }
}