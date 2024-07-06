import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { User } from '../user.model';
import { Connector } from '../connector.model';

@Table({
  tableName: 'UserConnectors',
  timestamps: false,
})
export class UserConnector extends Model<UserConnector> {
  @ForeignKey(() => User)
  @Column(DataType.UUID)
  userId!: string;

  @ForeignKey(() => Connector)
  @Column(DataType.UUID)
  connectorId!: string;
}
