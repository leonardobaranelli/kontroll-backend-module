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
type MaybeDate = Date | string | null;

@Table({
  tableName: 'shipments',
  freezeTableName: true,
  timestamps: false,
})
export class Shipment extends Model<Shipment> implements IShipment {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  HousebillNumber!: string;

  @AllowNull(true)
  @Column(DataType.JSONB)
  Origin?: {
    LocationCode?: MaybeString;
    LocationName?: MaybeString;
    CountryCode?: MaybeString;
  };

  @AllowNull(true)
  @Column(DataType.JSONB)
  Destination?: {
    LocationCode?: MaybeString;
    LocationName?: MaybeString;
    CountryCode?: MaybeString;
  };

  @AllowNull(true)
  @Column(DataType.JSONB)
  DateAndTimes?: {
    ScheduledDeparture?: MaybeDate;
    ScheduledArrival?: MaybeDate;
    ShipmentDate?: MaybeDate;
  };

  @AllowNull(true)
  @Column(DataType.STRING)
  ProductType!: string | null;

  @AllowNull(true)
  @Column(DataType.INTEGER)
  TotalPackages!: number | null;

  @AllowNull(true)
  @Column(DataType.JSONB)
  TotalWeight?: {
    '*body': MaybeNumber;
    '@uom': MaybeString;
  };

  @AllowNull(true)
  @Column(DataType.JSONB)
  TotalVolume?: {
    '*body': MaybeNumber;
    '@uom': MaybeString;
  };

  @AllowNull(true)
  @Column(DataType.JSONB)
  Timestamp?: Array<{
    TimestampCode?: MaybeString;
    TimestampDescription?: MaybeString;
    TimestampDateTime?: MaybeDate;
    TimestampLocation?: MaybeString;
  }>;

  @AllowNull(true)
  @Column(DataType.STRING)
  brokerName?: MaybeString;

  @AllowNull(true)
  @Column(DataType.STRING)
  incoterms?: MaybeString;

  @AllowNull(true)
  @Column(DataType.STRING)
  shipmentDate?: MaybeDate;

  @AllowNull(true)
  @Column(DataType.STRING)
  booking?: MaybeString;

  @AllowNull(true)
  @Column(DataType.STRING)
  mawb?: MaybeString;

  @AllowNull(true)
  @Column(DataType.STRING)
  hawb?: MaybeString;

  @AllowNull(true)
  @Column(DataType.STRING)
  flight?: MaybeString;

  @AllowNull(true)
  @Column(DataType.STRING)
  airportOfDeparture?: MaybeString;

  @AllowNull(true)
  @Column(DataType.STRING)
  etd?: MaybeDate;

  @AllowNull(true)
  @Column(DataType.STRING)
  atd?: MaybeDate;

  @AllowNull(true)
  @Column(DataType.STRING)
  airportOfArrival?: MaybeString;

  @AllowNull(true)
  @Column(DataType.STRING)
  eta?: MaybeDate;

  @AllowNull(true)
  @Column(DataType.STRING)
  ata?: MaybeDate;

  @AllowNull(true)
  @Column(DataType.STRING)
  vessel?: MaybeString;

  @AllowNull(true)
  @Column(DataType.STRING)
  portOfLoading?: MaybeString;

  @AllowNull(true)
  @Column(DataType.STRING)
  mbl?: MaybeString;

  @AllowNull(true)
  @Column(DataType.STRING)
  hbl?: MaybeString;

  @AllowNull(true)
  @Column(DataType.STRING)
  pickupDate?: MaybeDate;

  @AllowNull(true)
  @Column(DataType.STRING)
  containerNumber?: MaybeString;

  @AllowNull(true)
  @Column(DataType.STRING)
  portOfUnloading?: MaybeString;

  @AllowNull(true)
  @Column(DataType.STRING)
  finalDestination?: MaybeString;

  @AllowNull(true)
  @Column(DataType.STRING)
  internationalCarrier?: MaybeString;

  @AllowNull(true)
  @Column(DataType.STRING)
  voyage?: MaybeString;

  @AllowNull(true)
  @Column(DataType.STRING)
  portOfReceipt?: MaybeString;

  @AllowNull(true)
  @Column(DataType.TEXT)
  goodsDescription?: MaybeString;

  @AllowNull(true)
  @Column(DataType.JSONB)
  containers?: Array<any> | null;

  @BelongsToMany(() => Connector, () => ConnectorShipment)
  connectors!: Connector[];
}
