import { Request, Response } from 'express';
import { validateOrReject } from 'class-validator';
import { plainToClass } from 'class-transformer';
import {
 sendSuccessResponse,
 sendErrorResponse,
} from './helpers/commons/handlers/responses.handler';
import { CreateConnectorDto, UpdateConnectorDto } from '../utils/dtos';
import ConnectorService from '../services/connector.service';
import { isErrorArray } from './helpers/commons/is-error-array.helper';
import { IConnectorPublic } from '../utils/types/utilities.interface';


export default class ConnectorController {
 public static getAll = async (
   _req: Request,
   res: Response,
 ): Promise<void> => {
   try {
     const connectors: IConnectorPublic[] =
       await ConnectorService.getAllConnectors();
     sendSuccessResponse(res, connectors, 'Connectors retrieved successfully');
   } catch (error: any) {
     sendErrorResponse(res, error, error.statusCode || 400);
   }
 };


 public static getByType = async (
   req: Request,
   res: Response,
 ): Promise<void> => {
   const type = req.params.type as string;


   try {
     const connector: IConnectorPublic[] | null =
       await ConnectorService.getConnectorByType(type);
     sendSuccessResponse(
       res,
       connector,
       `Connector with type ${type} retrieved successfully`,
     );
   } catch (error: any) {
     sendErrorResponse(res, error, error.statusCode || 400);
   }
 };


 public static getById = async (
   req: Request,
   res: Response,
  ): Promise<void> => {
    const connectorId = req.params.id as string;
 
 
    try {
      const connector: IConnectorPublic | null =
        await ConnectorService.getConnectorById(connectorId);
      sendSuccessResponse(res, connector, 'Connector retrieved successfully');
    } catch (error: any) {
      sendErrorResponse(res, error, error.statusCode || 400);
    }
  };
 
 
  public static create = async (req: Request, res: Response): Promise<void> => {
    const connectorData: CreateConnectorDto = plainToClass(
      CreateConnectorDto,
      req.body,
    ) as CreateConnectorDto;
 
 
    try {
      await validateOrReject(connectorData);
 
 
      const newConnector: IConnectorPublic | null =
        await ConnectorService.createConnector(connectorData);
      sendSuccessResponse(
        res,
        newConnector,
        'Connector created successfully',
        201,
      );
    } catch (error: any) {
      if (isErrorArray(error)) {
        const errorMessage: string = error
          .map((err) => Object.values(err.constraints || {}))
          .join(', ');
        sendErrorResponse(res, new Error(errorMessage));
      } else {
        sendErrorResponse(res, error as Error);
      }
    }
  };
  public static updateByType = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const type = req.params.type as string;
    const newData: UpdateConnectorDto = plainToClass(
      UpdateConnectorDto,
      req.body,
    ) as UpdateConnectorDto;
 
 
    try {
      const updatedConnector: IConnectorPublic | null =
        await ConnectorService.updateConnectorByType(type, newData);
      sendSuccessResponse(
        res,
        updatedConnector,
        `Connectors with type ${type} updated successfully`,
      );
    } catch (error: any) {
      sendErrorResponse(res, error, error.statusCode || 400);
    }
  };
 
 
  public static updateById = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const connectorId = req.params.id as string;
    const newData: UpdateConnectorDto = plainToClass(
      UpdateConnectorDto,
      req.body,
    ) as UpdateConnectorDto;
 
 
    try {
      const updatedConnector: IConnectorPublic | null =
        await ConnectorService.updateConnectorById(connectorId, newData);
      sendSuccessResponse(
        res,
        updatedConnector,
        `Connector with ID ${connectorId} updated successfully`,
      );
    } catch (error: any) {
      sendErrorResponse(res, error, error.statusCode || 400);
    }
  };
 
 
  public static deleteAll = async (
    _req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      await ConnectorService.deleteAllConnectors();
      sendSuccessResponse(res, null, 'All connectors deleted successfully');
    } catch (error: any) {
      sendErrorResponse(res, error, error.statusCode || 400);
    }
  };
 
 
  public static deleteByType = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const type: string = req.params.type;
 
 
    try {
      await ConnectorService.deleteConnectorByType(type);
      sendSuccessResponse(
        res,
        null,
        `Connectors with type ${type} deleted successfully`,
      );
    } catch (error: any) {
      sendErrorResponse(res, error, error.statusCode || 400);
    }
  };
 
 
  public static deleteById = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const connectorId: string = req.params.id;
 
 
    try {
      await ConnectorService.deleteConnectorById(connectorId);
      sendSuccessResponse(
        res,
        null,
        `Connector with ID ${connectorId} deleted successfully`,
      );
    } catch (error: any) {
      sendErrorResponse(res, error, error.statusCode || 400);
    }
  };
 }
 
 
 
 
 
 import { IConnector } from '@/utils/types/models.interface';
 
 
 export class ConnectorFirebase implements IConnector {
  id!: string;
  type!: string;
  users?: string[];
 }
 
 
   