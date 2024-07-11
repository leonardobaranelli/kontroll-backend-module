import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { Connector } from '../connector.model';
import { Carrier } from '../carrier.model';

@Table({
  tableName: 'ConnectorCarriers',
  timestamps: false,
})
export class ConnectorCarrier extends Model<ConnectorCarrier> {
  @ForeignKey(() => Connector)
  @Column(DataType.UUID)
  connectorId!: string;

  @ForeignKey(() => Carrier)
  @Column(DataType.UUID)
  carrierId!: string;
}
