import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  AllowNull,
  Unique,
} from 'sequelize-typescript';
import { IUser } from '../utils/types/models.interface';

@Table({
  tableName: 'users',
  freezeTableName: true,
  timestamps: false,
})
export class User extends Model<IUser> implements IUser {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  name!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  lastName!: string;

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING)
  username!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  password!: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  avatarUrl?: string | null;

  @AllowNull(false)
  @Default('user')
  @Column(DataType.ENUM('user', 'admin'))
  role!: 'user' | 'admin';
}
