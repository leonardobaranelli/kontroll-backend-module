import { Request, Response } from 'express';
import { validateOrReject } from 'class-validator';
import { plainToClass } from 'class-transformer';
import {
  sendSuccessResponse,
  sendErrorResponse,
} from './helpers/handlers/responses.handler';
import { CreateUserDto, UpdateUserDto } from '../utils/dtos';
import UserService from '../services/user.service';
import { isErrorArray } from './helpers/is-error-array.helper';
import { IUserPublic } from '../utils/types/utilities.interface';

export default class UserController {
  public static getAll = async (
    _req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const users: IUserPublic[] = await UserService.getAllUsers();
      sendSuccessResponse(res, users, 'Users retrieved successfully');
    } catch (error: any) {
      sendErrorResponse(res, error, error.statusCode || 400);
    }
  };

  public static getByUsername = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const username = req.params.username as string;

    try {
      const user: IUserPublic | null = await UserService.getUserByUsername(
        username,
      );
      sendSuccessResponse(
        res,
        user,
        `Username ${username} retrieved successfully`,
      );
    } catch (error: any) {
      sendErrorResponse(res, error, error.statusCode || 400);
    }
  };

  public static getById = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const userId = req.params.id as string;

    try {
      const user: IUserPublic | null = await UserService.getUserById(userId);
      sendSuccessResponse(res, user, 'User retrieved successfully');
    } catch (error: any) {
      sendErrorResponse(res, error, error.statusCode || 400);
    }
  };

  public static login = async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body as {
      username: string;
      password: string;
    };

    try {
      const token: string = await UserService.login(username, password);
      sendSuccessResponse(res, { token }, 'Login successful');
    } catch (error: any) {
      sendErrorResponse(res, error, error.statusCode || 400);
    }
  };

  public static register = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const userData: CreateUserDto = plainToClass(
      CreateUserDto,
      req.body,
    ) as CreateUserDto;

    try {
      await validateOrReject(userData);

      const newUser: IUserPublic | null = await UserService.registerUser(
        userData,
      );
      sendSuccessResponse(res, newUser, 'User created successfully', 201);
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

  public static updateByUsername = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const username = req.params.username as string;
    const newData: UpdateUserDto = req.body as UpdateUserDto;

    try {
      const updatedUser: IUserPublic | null =
        await UserService.updateUserByUsername(username, newData);
      sendSuccessResponse(
        res,
        updatedUser,
        `User ${username} updated successfully`,
      );
    } catch (error: any) {
      sendErrorResponse(res, error, error.statusCode || 400);
    }
  };

  public static updateById = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const userId = req.params.id as string;
    const newData: UpdateUserDto = req.body as UpdateUserDto;

    try {
      const updatedUser: IUserPublic | null = await UserService.updateUserById(
        userId,
        newData,
      );
      sendSuccessResponse(
        res,
        updatedUser,
        `User with ID ${userId} updated successfully`,
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
      await UserService.deleteAllUsers();
      sendSuccessResponse(res, null, 'All users deleted successfully');
    } catch (error: any) {
      sendErrorResponse(res, error, error.statusCode || 400);
    }
  };

  public static deleteByUsername = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const username = req.params.username as string;

    try {
      await UserService.deleteUserByUsername(username);
      sendSuccessResponse(
        res,
        null,
        `Username ${username} deleted successfully`,
      );
    } catch (error: any) {
      sendErrorResponse(res, error, error.statusCode || 400);
    }
  };

  public static deleteById = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const userId = req.params.id as string;

    try {
      await UserService.deleteUserById(userId);
      sendSuccessResponse(
        res,
        null,
        `User with ID ${userId} deleted successfully`,
      );
    } catch (error: any) {
      sendErrorResponse(res, error, error.statusCode || 400);
    }
  };
}
