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
    ScheduledDeparture: string | null;
    ScheduledArrival: string | null;
    ShipmentDate: string | null;
  };

  @AllowNull(true)
  @Column(DataType.STRING)
  ProductType!: string | null;

  @AllowNull(true)
  @Column(DataType.INTEGER)
  TotalPackages!: number | null;

  @AllowNull(false)
  @Column(DataType.JSONB)
  TotalWeight!: {
    '*body': number | null;
    '@uom': string | null;
  };

  @AllowNull(false)
  @Column(DataType.JSONB)
  TotalVolume!: {
    '*body': number | null;
    '@uom': string | null;
  };

  @AllowNull(false)
  @Column(DataType.JSONB)
  Timestamp!: Array<{
    TimestampCode: string;
    TimestampDescription: string;
    TimestampDateTime: string;
    TimestampLocation: string;
  }>;

  @AllowNull(true)
  @Column(DataType.STRING)
  brokerName!: string | null;

  @AllowNull(true)
  @Column(DataType.STRING)
  incoterms!: string | null;

  @AllowNull(true)
  @Column(DataType.STRING)
  shipmentDate!: string | null;

  @AllowNull(true)
  @Column(DataType.STRING)
  booking!: string | null;

  @AllowNull(true)
  @Column(DataType.STRING)
  mawb!: string | null;

  @AllowNull(true)
  @Column(DataType.STRING)
  hawb!: string | null;

  @AllowNull(true)
  @Column(DataType.STRING)
  flight!: string | null;

  @AllowNull(true)
  @Column(DataType.STRING)
  airportOfDeparture!: string | null;

  @AllowNull(true)
  @Column(DataType.STRING)
  etd!: string | null;

  @AllowNull(true)
  @Column(DataType.STRING)
  atd!: string | null;

  @AllowNull(true)
  @Column(DataType.STRING)
  airportOfArrival!: string | null;

  @AllowNull(true)
  @Column(DataType.STRING)
  eta!: string | null;

  @AllowNull(true)
  @Column(DataType.STRING)
  ata!: string | null;

  @AllowNull(true)
  @Column(DataType.STRING)
  finalDestination!: string | null;

  @AllowNull(true)
  @Column(DataType.STRING)
  internationalCarrier!: string | null;

  @AllowNull(true)
  @Column(DataType.STRING)
  voyage!: string | null;

  @AllowNull(true)
  @Column(DataType.STRING)
  portOfReceipt!: string | null;

  @AllowNull(true)
  @Column(DataType.STRING)
  goodsDescription!: string | null;

  @AllowNull(true)
  @Column(DataType.STRING)
  vessel!: string | null;

  @AllowNull(true)
  @Column(DataType.STRING)
  portOfLoading!: string | null;

  @AllowNull(true)
  @Column(DataType.STRING)
  mbl!: string | null;

  @AllowNull(true)
  @Column(DataType.STRING)
  hbl!: string | null;

  @AllowNull(true)
  @Column(DataType.STRING)
  pickupDate!: string | null;

  @AllowNull(true)
  @Column(DataType.STRING)
  containerNumber!: string | null;

  @AllowNull(true)
  @Column(DataType.STRING)
  portOfUnloading!: string | null;

  @AllowNull(true)
  @Column(DataType.JSONB)
  containers!: Array<any> | null;

  @BelongsToMany(() => Connector, () => ConnectorShipment)
  connectors!: Connector[];
}
