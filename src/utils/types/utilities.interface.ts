import { Property } from '../decorators/property.decorator';

type MaybeString = string | null;
type MaybeNumber = number | null;

export interface IError extends Error {
  statusCode?: number;
}

export interface IUserPublic {
  id: string;
  name: string;
  lastName: string;
  username: string;
}

// Public User with metadata
export class AbstractUserPublic {
  @Property()
  id!: string;
  @Property()
  name!: string;
  @Property()
  lastName!: string;
  @Property()
  username!: string;

  constructor() {
    this.id = '';
    this.name = '';
    this.lastName = '';
    this.username = '';
  }
}

export interface IConnectorPublic {
  id: string;
  type: string;
}

// Public Connector with metadata
export class AbstractConnectorPublic {
  @Property()
  id!: string;
  @Property()
  type!: string;

  constructor() {
    this.id = '';
    this.type = '';
  }
}

export interface IShipmentPublic {
  HousebillNumber: string;
  Origin: {
    LocationCode: string; // Codigo de ubicacion de origen, formato ISO-3166
    LocationName: string;
    CountryCode: string;
  };
  Destination: {
    LocationCode: string; // Codigo de ubicacion de destino, formato ISO-3166
    LocationName: string;
    CountryCode: string;
  };
  DateAndTimes: {
    ScheduledDeparture: string;
    ScheduledArrival: string;
    ShipmentDate: string;
  };
  ProductType?: MaybeString;
  TotalPackages?: MaybeNumber;
  TotalWeight: {
    body: number;
    uom: string;
  };
  TotalVolume: {
    body: number;
    uom: string;
  };
  Timestamp: {
    TimestampCode: string;
    TimestampDescription: string;
    TimestampDateTime: Date;
    TimestampLocation: string;
  };
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
