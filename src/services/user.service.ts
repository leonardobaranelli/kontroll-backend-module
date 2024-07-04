import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';
import { CreateUserDto, UpdateUserDto } from '../utils/dtos';
import { IUser } from '../utils/types/models.interface';
import {
  IUserPublic,
  AbstractUserPublic,
  IError,
} from '../utils/types/utilities.interface';
import { getAttributes } from './helpers/get-atributes.helper';

export default class UserService {
  public static async getAllUsers(): Promise<IUserPublic[]> {
    try {
      const allUsers: IUserPublic[] = await User.findAll({
        attributes: getAttributes(AbstractUserPublic),
      });

      if (allUsers.length === 0) {
        const error: IError = new Error('There are no users registered yet');
        error.statusCode = 404;
        throw error;
      }
      return allUsers;
    } catch (error) {
      throw error;
    }
  }

  public static async getUserByUsername(
    username: string,
  ): Promise<IUserPublic> {
    try {
      const user: IUserPublic | null = await User.findOne({
        where: { username: username },
        attributes: getAttributes(AbstractUserPublic),
      });

      if (!user) {
        const error: IError = new Error(`Username ${username} not found`);
        error.statusCode = 404;
        throw error;
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  public static async getUserById(id: string): Promise<IUserPublic> {
    try {
      const user: IUserPublic | null = await User.findByPk(id, {
        attributes: getAttributes(AbstractUserPublic),
      });
      if (!user) {
        const error: IError = new Error(`User with ${id} not found`);
        error.statusCode = 404;
        throw error;
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  public static async registerUser(
    userData: CreateUserDto,
  ): Promise<IUserPublic> {
    const { username } = userData;

    try {
      const existingUser: IUserPublic | null = await User.findOne({
        where: { username },
        attributes: getAttributes(AbstractUserPublic),
      });
      if (existingUser) {
        const error: IError = new Error(
          `User ${username} has already been registered`,
        );
        error.statusCode = 409;
        throw error;
      }

      const hashedPassword: string = await bcrypt.hash(userData.password, 10);
      userData.password = hashedPassword;

      const newUser: IUserPublic = await User.create(userData);

      return newUser;
    } catch (error) {
      throw error;
    }
  }

  public static async login(
    username: string,
    password: string,
  ): Promise<string> {
    try {
      const user: IUser | null = await User.findOne({ where: { username } });

      if (!user) {
        const error: IError = new Error(`User not found`);
        error.statusCode = 404;
        throw error;
      }

      const passwordMatch: boolean = await bcrypt.compare(
        password,
        user.password,
      );

      if (!passwordMatch) {
        const error: IError = new Error('Invalid credentials');
        error.statusCode = 401;
        throw error;
      }

      const token: string = jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET as string,
        { expiresIn: '1h' },
      );

      return token;
    } catch (error) {
      throw error;
    }
  }

  public static async updateUserByUsername(
    username: string,
    newData: UpdateUserDto,
  ): Promise<IUserPublic> {
    try {
      const [updatedRows]: [number] = await User.update(newData, {
        where: { username: username },
      });
      if (updatedRows === 0) {
        const error: IError = new Error(`Username ${username} not found`);
        error.statusCode = 404;
        throw error;
      }
      const updatedUser: IUserPublic | null = await User.findOne({
        where: { username: username },
        attributes: getAttributes(AbstractUserPublic),
      });
      return updatedUser as IUserPublic;
    } catch (error) {
      throw error;
    }
  }

  public static async updateUserById(
    id: string,
    newData: UpdateUserDto,
  ): Promise<IUserPublic> {
    try {
      const [updatedRows]: [number] = await User.update(newData, {
        where: { id },
      });
      if (updatedRows === 0) {
        const error: IError = new Error(`User with ID ${id} not found`);
        error.statusCode = 404;
        throw error;
      }
      const updatedUser: IUserPublic | null = await User.findByPk(id, {
        attributes: getAttributes(AbstractUserPublic),
      });
      return updatedUser as IUserPublic;
    } catch (error) {
      throw error;
    }
  }

  public static async deleteAllUsers(): Promise<void> {
    try {
      const deletedRows: number = await User.destroy({ where: {} });
      if (deletedRows === 0) {
        const error: IError = new Error('No users to delete');
        error.statusCode = 404;
        throw error;
      }
    } catch (error) {
      throw error;
    }
  }

  public static async deleteUserByUsername(username: string): Promise<void> {
    try {
      const deletedRows: number = await User.destroy({
        where: { username: username },
      });
      if (deletedRows === 0) {
        const error: IError = new Error(`Username ${username} not found`);
        error.statusCode = 404;
        throw error;
      }
    } catch (error) {
      throw error;
    }
  }

  public static async deleteUserById(id: string): Promise<void> {
    try {
      const deletedRows: number = await User.destroy({ where: { id } });
      if (deletedRows === 0) {
        const error: IError = new Error(`User with ID ${id} not found`);
        error.statusCode = 404;
        throw error;
      }
    } catch (error) {
      throw error;
    }
  }
}
