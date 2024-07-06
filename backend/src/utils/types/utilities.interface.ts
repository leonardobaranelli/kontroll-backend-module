import { Property } from '../decorators/property.decorator';

type MaybeString = string | null;

export interface IError extends Error {
  statusCode?: number;
}

export interface IUserPublic {
  id: string;
  name: string;
  lastName: string;
  username: string;
}

// Abstract class representing a public user with metadata
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
  name: string;
  apiUrl?: MaybeString;
}

// Abstract class representing a public connector with metadata
export class AbstractConnectorPublic {
  @Property()
  id!: string;
  @Property()
  name!: string;
  @Property()
  apiUrl?: MaybeString;

  constructor() {
    this.id = '';
    this.name = '';
    this.apiUrl = null;
  }
}

export interface IShipmentPublic {
  id: string;
  name: string;
  trackingNumber?: MaybeString;
  originCountry?: MaybeString;
  finalCountry?: MaybeString;
  departureDate?: MaybeString;
  arrivalDate?: MaybeString;
  status?: MaybeString;
  provider?: MaybeString;
  courier?: MaybeString;
}

// Abstract class representing a public shipment with metadata
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
