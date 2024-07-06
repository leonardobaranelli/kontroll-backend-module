import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { Connector } from '../connector.model';
import { Shipment } from '../shipment.model';

@Table({
  tableName: 'ConnectorShipments',
  timestamps: false,
})
export class ConnectorShipment extends Model<ConnectorShipment> {
  @ForeignKey(() => Connector)
  @Column(DataType.UUID)
  connectorId!: string;

  @ForeignKey(() => Shipment)
  @Column(DataType.UUID)
  shipmentId!: string;
}
