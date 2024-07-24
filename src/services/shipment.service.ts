import { Shipment } from '../models/shipment.model';
import { CreateShipmentDto, UpdateShipmentDto } from '../utils/dtos';
import {
  IShipmentPublic,
  AbstractShipmentPublic,
  IError,
} from '../utils/types/utilities.interface';
import { getAttributes } from './helpers/commons/get-attributes.helper';

export default class ShipmentService {
  private static async findShipment(
    HousebillNumber: string,
  ): Promise<IShipmentPublic | null> {
    const shipment = await Shipment.findOne({
      where: { HousebillNumber },
      attributes: getAttributes(AbstractShipmentPublic),
    });
    return shipment as IShipmentPublic | null;
  }

  private static createError(message: string, statusCode: number): IError {
    const error: IError = new Error(message);
    error.statusCode = statusCode;
    return error;
  }

  private static handleError(error: any): never {
    console.error('Error in ShipmentService:', error);
    throw error;
  }

  public static async getAllShipments(): Promise<IShipmentPublic[]> {
    try {
      const allShipments = await Shipment.findAll({
        attributes: getAttributes(AbstractShipmentPublic),
      });

      if (allShipments.length === 0) {
        throw this.createError('There are no shipments available', 404);
      }
      return allShipments as IShipmentPublic[];
    } catch (error) {
      return this.handleError(error);
    }
  }

  public static async getShipmentByNumber(
    HousebillNumber: string,
  ): Promise<IShipmentPublic> {
    try {
      const shipment = await this.findShipment(HousebillNumber);
      if (!shipment) {
        throw this.createError(
          `Shipment with number ${HousebillNumber} not found`,
          404,
        );
      }
      return shipment;
    } catch (error) {
      return this.handleError(error);
    }
  }

  public static async createShipment(
    shipmentData: CreateShipmentDto,
  ): Promise<IShipmentPublic> {
    try {
      const { HousebillNumber } = shipmentData;

      // Check in the external database
      const externalShipmentData = await this.checkExternalDatabase(
        HousebillNumber,
      );

      if (!externalShipmentData) {
        throw this.createError(
          `Shipment with HousebillNumber ${HousebillNumber} not found in external database`,
          404,
        );
      }

      // Check if it already exists in our database
      const existingShipment = await this.findShipment(HousebillNumber);
      if (existingShipment) {
        throw this.createError(
          `Shipment with HousebillNumber ${HousebillNumber} already exists in our database`,
          409,
        );
      }

      // Create the shipment with data from the external database
      const newShipment = await Shipment.create(
        this.prepareShipmentData(externalShipmentData),
      );
      return newShipment as IShipmentPublic;
    } catch (error) {
      return this.handleError(error);
    }
  }

  public static async updateShipmentByNumber(
    HousebillNumber: string,
    newData: UpdateShipmentDto,
  ): Promise<IShipmentPublic> {
    try {
      const updateData = this.prepareUpdateData(newData);
      const [updatedRows] = await Shipment.update(updateData, {
        where: { HousebillNumber },
      });

      if (updatedRows === 0) {
        throw this.createError(
          `Shipment with number ${HousebillNumber} not found`,
          404,
        );
      }

      const updatedShipment = await this.findShipment(HousebillNumber);
      if (!updatedShipment) {
        throw this.createError(
          `Updated shipment with number ${HousebillNumber} not found`,
          404,
        );
      }
      return updatedShipment;
    } catch (error) {
      return this.handleError(error);
    }
  }

  public static async deleteAllShipments(): Promise<void> {
    try {
      await Shipment.destroy({ where: {} });
    } catch (error) {
      return this.handleError(error);
    }
  }

  public static async deleteShipmentByNumber(
    HousebillNumber: string,
  ): Promise<void> {
    try {
      const result = await Shipment.destroy({ where: { HousebillNumber } });
      if (result === 0) {
        throw this.createError(
          `No shipments with number ${HousebillNumber} found`,
          404,
        );
      }
    } catch (error) {
      return this.handleError(error);
    }
  }

  private static prepareShipmentData(data: any): any {
    return {
      ...data,
      Origin: data.Origin ?? {
        LocationCode: '',
        LocationName: '',
        CountryCode: '',
      },
      Destination: data.Destination ?? {
        LocationCode: '',
        LocationName: '',
        CountryCode: '',
      },
      DateAndTimes: data.DateAndTimes ?? {
        ScheduledDeparture: null,
        ScheduledArrival: null,
        ShipmentDate: null,
      },
      TotalVolume: data.TotalVolume ?? { '*body': null, '@uom': null },
      Timestamp: data.Timestamp ?? [],
    };
  }

  private static prepareUpdateData(data: UpdateShipmentDto): any {
    const updateData = { ...data };
    if (updateData.TotalWeight) {
      updateData.TotalWeight = {
        '*body': updateData.TotalWeight['*body'],
        '@uom': updateData.TotalWeight['@uom'],
      };
    }
    if (updateData.TotalVolume) {
      updateData.TotalVolume = {
        '*body': updateData.TotalVolume['*body'],
        '@uom': updateData.TotalVolume['@uom'],
      };
    }
    if (updateData.Timestamp) {
      updateData.Timestamp = updateData.Timestamp.map((timestamp) => ({
        TimestampCode: timestamp.TimestampCode,
        TimestampDescription: timestamp.TimestampDescription,
        TimestampDateTime: timestamp.TimestampDateTime,
        TimestampLocation: timestamp.TimestampLocation,
      }));
    }
    return updateData;
  }

  private static async checkExternalDatabase(
    HousebillNumber: string,
  ): Promise<any> {
    // This method should be implemented to check the external database
    // and return the shipment data if found
    // For now, it's a placeholder
    throw new Error('Method not implemented');
  }
}