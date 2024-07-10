type MaybeString = string | null;
type MaybeNumber = number | null;

export interface IUser {
  id: MaybeString;
  name: string;
  lastName: string;
  username: string;
  password: string;
  avatarUrl?: MaybeString;
  role?: 'user' | 'admin';
}

export interface IConnector {
  id: MaybeString;
  name: string;
  apiUrl?: MaybeString;
  apiKey?: MaybeString;
}

export interface IShipment {
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
