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
    shipmentData: CreateShipmentDto,
  ): Promise<IShipmentPublic> {
    const { HousebillNumber } = shipmentData;

    try {
      const existingShipment: IShipmentPublic | null = await Shipment.findOne({
        where: { HousebillNumber },
        attributes: getAttributes(AbstractShipmentPublic),
      });

      if (existingShipment) {
        const error: IError = new Error(
          `Shipment with tracking number ${HousebillNumber} already exists`,
        );
        error.statusCode = 409;
        throw error;
      }

      const newShipment: IShipmentPublic = await Shipment.create(shipmentData);
      return newShipment;
    } catch (error) {
      throw error;
    }
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
