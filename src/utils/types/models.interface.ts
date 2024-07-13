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
  type: string;
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

export interface ICarrier {
  id: MaybeString;
  name: string;
  url: string;
  accountNumber?: MaybeString;
  apiKey?: MaybeString;
}

// Beginning of the Step region
export interface IStepDetails {
  step: number;
  stepTitle: string;
  details1: string;
  details2: string;
  details3: string;
  details4: string;
}

export interface IForm {
  instruction: string;
  label: string;
  title: string;
  placeholder: string;
}

export interface IStep {
  id: string;
  carrierId: string;
  stepsDetails: IStepDetails;
  form: IForm;
}
// End of the Step region
