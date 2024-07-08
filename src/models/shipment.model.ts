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
import { Connector } from './connector.model';
import { ConnectorShipment } from './pivot-tables/connector-shipment.model';
import { IShipment } from '../utils/types/models.interface';

type MaybeString = string | null;

@Table({
  tableName: 'shipments',
  freezeTableName: true,
  timestamps: false,
})
export class Shipment extends Model<IShipment> implements IShipment {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  name!: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  trackingNumber?: MaybeString;

  @AllowNull(true)
  @Column(DataType.STRING)
  originCountry?: MaybeString;

  @AllowNull(true)
  @Column(DataType.STRING)
  finalCountry?: MaybeString;

  @AllowNull(true)
  @Column(DataType.STRING)
  departureDate?: MaybeString;

  @AllowNull(true)
  @Column(DataType.STRING)
  arrivalDate?: MaybeString;

  @AllowNull(true)
  @Column(DataType.STRING)
  status?: MaybeString;

  @AllowNull(true)
  @Column(DataType.STRING)
  provider?: MaybeString;

  @AllowNull(true)
  @Column(DataType.STRING)
  courier?: MaybeString;

  @BelongsToMany(() => Connector, () => ConnectorShipment)
  connectors!: Connector[];
}
