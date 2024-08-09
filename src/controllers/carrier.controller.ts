import { Request, Response } from 'express';
import {
  sendSuccessResponse,
  sendErrorResponse,
} from './helpers/commons/handlers/responses.handler';
import CarrierService from '../services/carrier.service';
import { ICarrierPublic } from '../utils/types/utilities.interface';
import { StepKey } from '../utils/types/models.interface';
import { devVerifyStepRequest } from './helpers/carrier/dev/dev-verify-step-request.helper';
import { verifyKnownStepRequest } from './helpers/carrier/known/verify-known-step-request.helper';
import { verifyEndpointRequest } from './helpers/carrier/new/verify-endpoint-request.helper';

export default class CarrierController {
  public static getAll = async (
    _req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const connectors: ICarrierPublic[] =
        await CarrierService.getAllCarriers();
      sendSuccessResponse(res, connectors, 'Carriers retrieved successfully');
    } catch (error: any) {
      sendErrorResponse(res, error, error.statusCode || 400);
    }
  };

  public static createKnown = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      verifyKnownStepRequest(req, res, async () => {
        const { step, data } = req.body as {
          step: StepKey;
          data: any;
        };

        const result = await CarrierService.createKnown(
          step,
          data,
          req.sessionID,
        );
        sendSuccessResponse(res, result, 'Step completed successfully');
      });
    } catch (error: any) {
      sendErrorResponse(res, error);
    }
  };

  public static createNew = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      verifyEndpointRequest(req, res, async () => {
        const { name, shipmentId, endpoints } = req.body as {
          name: string;
          shipmentId: string;
          endpoints: Array<object>;
        };

        const result = await CarrierService.createNew(
          name,
          shipmentId,
          endpoints,
          req.sessionID,
        );
        sendSuccessResponse(res, result, 'Endpoint added successfully');
      });
    } catch (error: any) {
      sendErrorResponse(res, error);
    }
  };

  public static devGetReqViaDoc = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      devVerifyStepRequest(req, res, async () => {
        const { step, data } = req.body as {
          step: any;
          data: any;
        };

        const result = await CarrierService.devGetReqViaDoc(
          step,
          data,
          req.sessionID,
        );
        sendSuccessResponse(res, result, 'Step completed successfully');
      });
    } catch (error: any) {
      sendErrorResponse(res, error);
    }
  };

  public static deleteById = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const carrierId = req.params.id as string;

    try {
      await CarrierService.deleteCarrierById(carrierId);
      sendSuccessResponse(
        res,
        null,
        `Carrier with ID ${carrierId} deleted successfully`,
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
      await CarrierService.deleteAllCarriers();
      sendSuccessResponse(res, null, 'All carriers deleted successfully');
    } catch (error: any) {
      sendErrorResponse(res, error, error.statusCode || 400);
    }
  };
}
