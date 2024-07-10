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
type MaybeNumber = number | null;

@Table({
  tableName: 'shipments',
  freezeTableName: true,
  timestamps: false,
})
export class Shipment extends Model<IShipment> implements IShipment {
  @PrimaryKey
  @Default(DataType.STRING)
  @Column(DataType.STRING)
  HousebillNumber!: string;

  @AllowNull(false)
  @Column(DataType.JSONB)
  Origin!: {
    LocationCode: string;
    LocationName: string;
    CountryCode: string;
  };

  @AllowNull(false)
  @Column(DataType.JSONB)
  Destination!: {
    LocationCode: string;
    LocationName: string;
    CountryCode: string;
  };

  @AllowNull(false)
  @Column(DataType.JSONB)
  DateAndTimes!: {
    ScheduledDeparture: string;
    ScheduledArrival: string;
    ShipmentDate: string;
  };

  @AllowNull(true)
  @Column(DataType.STRING)
  ProductType?: MaybeString;

  @AllowNull(true)
  @Column(DataType.NUMBER)
  TotalPackages?: MaybeNumber;

  @AllowNull(false)
  @Column(DataType.JSONB)
  TotalWeight!: {
    body: number;
    uom: string;
  };

  @AllowNull(false)
  @Column(DataType.JSONB)
  TotalVolume!: {
    body: number;
    uom: string;
  };

  @AllowNull(false)
  @Column(DataType.JSONB)
  Timestamp!: {
    TimestampCode: string;
    TimestampDescription: string;
    TimestampDateTime: Date;
    TimestampLocation: string;
  };

  @BelongsToMany(() => Connector, () => ConnectorShipment)
  connectors!: Connector[];
}
