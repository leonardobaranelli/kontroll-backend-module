import { Property } from '../decorators/property.decorator';
import { IShipment } from './models.interface';

type MaybeString = string | null;
type MaybeNumber = number | null;
type MaybeDate = Date | string | null;

export interface IError extends Error {
  statusCode?: number;
}

export interface ShipmentInput {
  [key: string]: any;
}

export interface ParserResult {
  success: boolean;
  data?: IShipment;
  error?: string;
  mappingDictionary?: Record<string, string>;
}

export interface ParserOptions {
  useOpenAI: boolean;
}

export interface IShipmentPublic {
  HousebillNumber: string;
  Origin?: {
    LocationCode?: MaybeString;
    LocationName?: MaybeString;
    CountryCode?: MaybeString;
  };
  Destination?: {
    LocationCode?: MaybeString;
    LocationName?: MaybeString;
    CountryCode?: MaybeString;
  };
  DateAndTimes?: {
    ScheduledDeparture?: MaybeDate;
    ScheduledArrival?: MaybeDate;
    ShipmentDate?: MaybeDate;
  };
  ProductType?: MaybeString;
  TotalPackages?: MaybeNumber;
  TotalWeight?: {
    '*body': MaybeNumber;
    '@uom': MaybeString;
  };
  TotalVolume?: {
    '*body': MaybeNumber;
    '@uom': MaybeString;
  };
  Timestamp?: Array<{
    TimestampCode?: MaybeString;
    TimestampDescription?: MaybeString;
    TimestampDateTime?: MaybeDate;
    TimestampLocation?: MaybeString;
  }>;
  brokerName?: MaybeString;
  incoterms?: MaybeString;
  shipmentDate?: MaybeDate;
  booking?: MaybeString;
  mawb?: MaybeString;
  hawb?: MaybeString;
  flight?: MaybeString;
  airportOfDeparture?: MaybeString;
  etd?: MaybeDate;
  atd?: MaybeDate;
  airportOfArrival?: MaybeString;
  eta?: MaybeDate;
  ata?: MaybeDate;
  vessel?: MaybeString;
  portOfLoading?: MaybeString;
  mbl?: MaybeString;
  hbl?: MaybeString;
  pickupDate?: MaybeDate;
  containerNumber?: MaybeString;
  portOfUnloading?: MaybeString;
  finalDestination?: MaybeString;
  internationalCarrier?: MaybeString;
  voyage?: MaybeString;
  portOfReceipt?: MaybeString;
  goodsDescription?: MaybeString;
  containers?: Array<any> | null;
}

// Public Shipment with metadata
export class AbstractShipmentPublic {
  @Property()
  id!: string;
  @Property()
  name!: string;
  @Property()
  trackingNumber?: MaybeString;
  @Property()
  originCountry?: MaybeString;
  @Property()
  finalCountry?: MaybeString;
  @Property()
  departureDate?: MaybeString;
  @Property()
  arrivalDate?: MaybeString;
  @Property()
  status?: MaybeString;
  @Property()
  provider?: MaybeString;
  @Property()
  courier?: MaybeString;

  constructor() {
    this.id = '';
    this.name = '';
    this.trackingNumber = null;
    this.originCountry = null;
    this.finalCountry = null;
    this.departureDate = null;
    this.arrivalDate = null;
    this.status = null;
    this.provider = null;
    this.courier = null;
  }
}

export interface ICarrierPublic {
  id: MaybeString;
  name: string;
  url: string;
  memoryParser?: {};
}

// Public Carrier with metadata
export class AbstractCarrierPublic {
  @Property()
  id!: string;
  @Property()
  name!: string;
  @Property()
  url!: string;

  constructor() {
    this.id = '';
    this.name = '';
    this.url = '';
  }
}
