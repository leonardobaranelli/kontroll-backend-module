import { Request, Response } from 'express';
import {
  sendSuccessResponse,
  sendErrorResponse,
} from './helpers/commons/handlers/responses.handler';
//import CarrierService from '../services/carrier.service';

export default class CarrierController {
  public static create = async (
    _req: Request,
    res: Response,
  ): Promise<void> => {
    //const { service, currentStep, data } = req.body;

    try {
      // const result = await CarrierService.handleStep(
      //   service,
      //   currentStep,
      //   data,
      //   req.sessionID,
      // );
      sendSuccessResponse(res, 'result', 'hi friend');
    } catch (error: any) {
      sendErrorResponse(res, error as Error);
    }
  };
}
