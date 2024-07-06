import { Shipment } from '../models/shipment.model';
import { CreateShipmentDto, UpdateShipmentDto } from '../utils/dtos';
import { IShipment } from '../utils/types/models.interface';
import {
  IShipmentPublic,
  AbstractShipmentPublic,
  IError,
} from '../utils/types/utilities.interface';
import { getAttributes } from './helpers/get-atributes.helper';
import axios from 'axios';

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

  public static async getShipmentByName(
    name: string,
  ): Promise<IShipmentPublic> {
    try {
      const shipment: IShipmentPublic | null = await Shipment.findOne({
        where: { name },
        attributes: getAttributes(AbstractShipmentPublic),
      });

      if (!shipment) {
        const error: IError = new Error(`Shipment with name ${name} not found`);
        error.statusCode = 404;
        throw error;
      }
      return shipment;
    } catch (error) {
      throw error;
    }
  }

  public static async getShipmentByTrackingNumber(
    trackingNumber: string,
  ): Promise<IShipmentPublic> {
    try {
      const shipment: IShipmentPublic | null = await Shipment.findOne({
        where: { trackingNumber },
        attributes: getAttributes(AbstractShipmentPublic),
      });

      if (!shipment) {
        const error: IError = new Error(
          `Shipment with tracking number ${trackingNumber} not found`,
        );
        error.statusCode = 404;
        throw error;
      }
      return shipment;
    } catch (error) {
      throw error;
    }
  }

  public static async getShipmentById(id: string): Promise<IShipmentPublic> {
    try {
      const shipment: IShipmentPublic | null = await Shipment.findByPk(id, {
        attributes: getAttributes(AbstractShipmentPublic),
      });

      if (!shipment) {
        const error: IError = new Error(`Shipment with ID ${id} not found`);
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
    const { trackingNumber } = shipmentData;

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

      const newShipment: IShipmentPublic = await Shipment.create(shipmentData);
      return newShipment;
    } catch (error) {
      throw error;
    }
  }

  public static async formatAndValidateShipment(
    shipmentData: IShipment,
  ): Promise<IShipmentPublic> {
    try {
      const response = await axios.post<IShipmentPublic>(
        'http://localhost:5000/add_shipment',
        shipmentData,
      );
      return response.data;
    } catch (error) {
      console.error('Error in AI formatting and validation:', error);
      throw error;
    }
  }

  public static async updateShipmentByName(
    name: string,
    newData: UpdateShipmentDto,
  ): Promise<IShipmentPublic> {
    try {
      const [updatedRows]: [number] = await Shipment.update(newData, {
        where: { name },
      });

      if (updatedRows === 0) {
        const error: IError = new Error(`Shipment with name ${name} not found`);
        error.statusCode = 404;
        throw error;
      }

      const updatedShipment: IShipmentPublic | null = await Shipment.findOne({
        where: { name },
        attributes: getAttributes(AbstractShipmentPublic),
      });

      return updatedShipment as IShipmentPublic;
    } catch (error) {
      throw error;
    }
  }

  public static async updateShipmentById(
    id: string,
    newData: UpdateShipmentDto,
  ): Promise<IShipmentPublic> {
    try {
      const [updatedRows]: [number] = await Shipment.update(newData, {
        where: { id },
      });

      if (updatedRows === 0) {
        const error: IError = new Error(`Shipment with ID ${id} not found`);
        error.statusCode = 404;
        throw error;
      }

      const updatedShipment: IShipmentPublic | null = await Shipment.findByPk(
        id,
        {
          attributes: getAttributes(AbstractShipmentPublic),
        },
      );

      return updatedShipment as IShipmentPublic;
    } catch (error) {
      throw error;
    }
  }

  public static async updateShipmentByTrackingNumber(
    trackingNumber: string,
    newData: UpdateShipmentDto,
  ): Promise<IShipmentPublic> {
    try {
      const [updatedRows]: [number] = await Shipment.update(newData, {
        where: { trackingNumber },
      });

      if (updatedRows === 0) {
        const error: IError = new Error(
          `Shipment with tracking number ${trackingNumber} not found`,
        );
        error.statusCode = 404;
        throw error;
      }

      const updatedShipment: IShipmentPublic | null = await Shipment.findOne({
        where: { trackingNumber },
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

  public static async deleteShipmentByName(name: string): Promise<void> {
    try {
      const shipments: Shipment[] | null = await Shipment.findAll({
        where: { name },
      });
      if (shipments.length === 0) {
        throw new Error(`No shipments with name ${name} found`);
      }
      await Shipment.destroy({ where: { name } });
    } catch (error) {
      throw error;
    }
  }

  public static async deleteShipmentByTrackingNumber(
    trackingNumber: string,
  ): Promise<void> {
    try {
      const shipment: Shipment | null = await Shipment.findOne({
        where: { trackingNumber },
      });
      if (!shipment) {
        throw new Error(
          `Shipment with tracking number ${trackingNumber} not found`,
        );
      }
      await Shipment.destroy({ where: { trackingNumber } });
    } catch (error) {
      throw error;
    }
  }

  public static async deleteShipmentById(id: string): Promise<void> {
    try {
      const shipment: Shipment | null = await Shipment.findByPk(id);
      if (!shipment) {
        throw new Error(`Shipment with ID ${id} not found`);
      }
      await Shipment.destroy({ where: { id } });
    } catch (error) {
      throw error;
    }
  }
}
