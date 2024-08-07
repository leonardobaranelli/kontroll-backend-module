import { Request, Response } from 'express';
import {
  sendSuccessResponse,
  sendErrorResponse,
} from './helpers/commons/handlers/responses.handler';
import ParsingDictionaryService from '../services/parsing-dictionary.service';
import { IParsingDictionary } from '../utils/types/models.interface';

export default class ParsingDictionaryController {
  public static getAll = async (
    _req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const parsingDictionaries: IParsingDictionary[] =
        await ParsingDictionaryService.getAllParsingDictionaries();
      sendSuccessResponse(
        res,
        parsingDictionaries,
        'Parsing dictionaries retrieved successfully',
      );
    } catch (error: any) {
      sendErrorResponse(res, error);
    }
  };

  public static getById = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const id = req.params.id;
    try {
      const parsingDictionary =
        await ParsingDictionaryService.getParsingDictionaryById(id);
      if (parsingDictionary) {
        sendSuccessResponse(
          res,
          parsingDictionary,
          'Parsing dictionary retrieved successfully',
        );
      } else {
        sendErrorResponse(res, new Error('Parsing dictionary not found'), 404);
      }
    } catch (error: any) {
      sendErrorResponse(res, error);
    }
  };

  public static create = async (req: Request, res: Response): Promise<void> => {
    try {
      const newParsingDictionary =
        await ParsingDictionaryService.createParsingDictionary(req.body);
      sendSuccessResponse(
        res,
        newParsingDictionary,
        'Parsing dictionary created successfully',
        201,
      );
    } catch (error: any) {
      sendErrorResponse(res, error);
    }
  };

  public static update = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
    try {
      const updatedParsingDictionary =
        await ParsingDictionaryService.updateParsingDictionary(id, req.body);
      if (updatedParsingDictionary) {
        sendSuccessResponse(
          res,
          updatedParsingDictionary,
          'Parsing dictionary updated successfully',
        );
      } else {
        sendErrorResponse(res, new Error('Parsing dictionary not found'), 404);
      }
    } catch (error: any) {
      sendErrorResponse(res, error);
    }
  };

  public static delete = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
    try {
      await ParsingDictionaryService.deleteParsingDictionary(id);
      sendSuccessResponse(res, null, 'Parsing dictionary deleted successfully');
    } catch (error: any) {
      sendErrorResponse(res, error);
    }
  };

  public static getByCarrier = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const carrier = req.params.carrier;
    try {
      const parsingDictionary =
        await ParsingDictionaryService.getParsingDictionaryByCarrier(carrier);
      if (parsingDictionary) {
        sendSuccessResponse(
          res,
          parsingDictionary,
          'Parsing dictionary retrieved successfully',
        );
      } else {
        sendErrorResponse(res, new Error('Parsing dictionary not found'), 404);
      }
    } catch (error: any) {
      sendErrorResponse(res, error);
    }
  };
}
