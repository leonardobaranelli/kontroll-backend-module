import { Request, Response } from 'express';
import {
  sendSuccessResponse,
  sendErrorResponse,
} from './helpers/commons/handlers/responses.handler';
import CarrierService from '../services/carrier.service';
import { ICarrierPublic } from '../utils/types/utilities.interface';
import { StepKey } from '@/services/helpers/carrier/dhl-global-forwarding/carrier-config.helper';
import { verifyStepRequest } from './helpers/carrier/dhl-global-forwarding/verify-step-request.helper';

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

  public static create = async (req: Request, res: Response): Promise<void> => {
    try {
      verifyStepRequest(req, res, async () => {
        const { step, data } = req.body as {
          step: StepKey;
          data: any;
        };

        const result = await CarrierService.handleStep(
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
