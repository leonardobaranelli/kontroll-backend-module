import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  AllowNull,
  BelongsToMany,
} from 'sequelize-typescript';
import { User } from './user.model';
import { UserConnector } from './pivot-tables/user-connector.model';
import { IConnector } from '../utils/types/models.interface';

type MaybeString = string | null;

@Table({
  tableName: 'connectors',
  timestamps: false,
})
export class Connector extends Model<IConnector> implements IConnector {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  name!: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  apiUrl?: MaybeString;

  @AllowNull(true)
  @Column(DataType.STRING)
  apiKey?: MaybeString;

  @BelongsToMany(() => User, () => UserConnector)
  users!: User[];
}
