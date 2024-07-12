import { Connector } from '../models/connector.model';
import { CreateConnectorDto, UpdateConnectorDto } from '../utils/dtos';
//import { IConnector } from '../utils/types/models.interface';
import {
  IConnectorPublic,
  AbstractConnectorPublic,
  IError,
} from '../utils/types/utilities.interface';
import { getAttributes } from './helpers/commons/get-attributes.helper';

export default class ConnectorService {
  public static async getAllConnectors(): Promise<IConnectorPublic[]> {
    try {
      const allConnectors: IConnectorPublic[] = await Connector.findAll({
        attributes: getAttributes(AbstractConnectorPublic),
      });

      if (allConnectors.length === 0) {
        const error: IError = new Error('There are no connectors available');
        error.statusCode = 404;
        throw error;
      }
      return allConnectors;
    } catch (error) {
      throw error;
    }
  }

  public static async getConnectorByType(
    type: string,
  ): Promise<IConnectorPublic> {
    try {
      const connector: IConnectorPublic | null = await Connector.findOne({
        where: { type },
        attributes: getAttributes(AbstractConnectorPublic),
      });

      if (!connector) {
        const error: IError = new Error(
          `Connector with type ${type} not found`,
        );
        error.statusCode = 404;
        throw error;
      }
      return connector;
    } catch (error) {
      throw error;
    }
  }

  public static async getConnectorById(id: string): Promise<IConnectorPublic> {
    try {
      const connector: IConnectorPublic | null = await Connector.findByPk(id, {
        attributes: getAttributes(AbstractConnectorPublic),
      });

      if (!connector) {
        const error: IError = new Error(`Connector with ID ${id} not found`);
        error.statusCode = 404;
        throw error;
      }
      return connector;
    } catch (error) {
      throw error;
    }
  }

  public static async createConnector(
    connectorData: CreateConnectorDto,
  ): Promise<IConnectorPublic> {
    try {
      const newConnector: IConnectorPublic =
        await Connector.create(connectorData);
      return newConnector;
    } catch (error) {
      throw error;
    }
  }

  public static async updateConnectorByType(
    type: string,
    newData: UpdateConnectorDto,
  ): Promise<IConnectorPublic> {
    try {
      const [updatedRows]: [number] = await Connector.update(newData, {
        where: { type },
      });

      if (updatedRows === 0) {
        const error: IError = new Error(
          `No connectors with type ${type} found`,
        );
        error.statusCode = 404;
        throw error;
      }

      const updatedConnector: IConnectorPublic | null = await Connector.findOne(
        {
          where: { type },
          attributes: getAttributes(AbstractConnectorPublic),
        },
      );

      return updatedConnector as IConnectorPublic;
    } catch (error) {
      throw error;
    }
  }

  public static async updateConnectorById(
    id: string,
    newData: UpdateConnectorDto,
  ): Promise<IConnectorPublic> {
    try {
      const [updatedRows]: [number] = await Connector.update(newData, {
        where: { id },
      });

      if (updatedRows === 0) {
        const error: IError = new Error(`Connector with ID ${id} not found`);
        error.statusCode = 404;
        throw error;
      }

      const updatedConnector: IConnectorPublic | null =
        await Connector.findByPk(id, {
          attributes: getAttributes(AbstractConnectorPublic),
        });

      return updatedConnector as IConnectorPublic;
    } catch (error) {
      throw error;
    }
  }

  public static async deleteAllConnectors(): Promise<void> {
    try {
      await Connector.destroy({ where: {} });
    } catch (error: unknown) {
      throw error;
    }
  }

  public static async deleteConnectorByType(type: string): Promise<void> {
    try {
      const deletedRows: number = await Connector.destroy({ where: { type } });
      if (deletedRows === 0) {
        throw new Error(`No connectors with type ${type} found`);
      }
    } catch (error: unknown) {
      throw error;
    }
  }

  public static async deleteConnectorById(id: string): Promise<void> {
    try {
      const deletedRows: number = await Connector.destroy({ where: { id } });
      if (deletedRows === 0) {
        throw new Error(`Connector with ID ${id} not found`);
      }
    } catch (error: unknown) {
      throw error;
    }
  }
}
