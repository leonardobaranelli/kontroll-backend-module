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
    LocationCode: string;
    LocationName: string;
    CountryCode: string;
  };
  Destination: {
    LocationCode: string;
    LocationName: string;
    CountryCode: string;
  };
  DateAndTimes: {
    ScheduledDeparture: string | null;
    ScheduledArrival: string | null;
    ShipmentDate: string | null;
  };
  ProductType: string | null;
  TotalPackages: number | null;
  TotalWeight: {
    '*body': number | null;
    '@uom': string | null;
  };
  TotalVolume: {
    '*body': number | null;
    '@uom': string | null;
  };
  Timestamp: Array<{
    TimestampCode: string;
    TimestampDescription: string;
    TimestampDateTime: string;
    TimestampLocation: string;
  }>;
  brokerName: string | null;
  incoterms: string | null;
  shipmentDate: string | null;
  booking: string | null;
  mawb: string | null;
  hawb: string | null;
  flight: string | null;
  airportOfDeparture: string | null;
  etd: string | null;
  atd: string | null;
  airportOfArrival: string | null;
  eta: string | null;
  ata: string | null;
  vessel: string | null;
  portOfLoading: string | null;
  mbl: string | null;
  hbl: string | null;
  pickupDate: string | null;
  containerNumber: string | null;
  portOfUnloading: string | null;
  finalDestination: string | null;
  internationalCarrier: string | null;
  voyage: string | null;
  portOfReceipt: string | null;
  goodsDescription: string | null;
  containers: Array<any> | null;
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
