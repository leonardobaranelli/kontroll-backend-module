type MaybeString = string | null;
type MaybeNumber = number | null;
type MaybeDate = Date | string | null;

// Beginning of the Carrier region
export interface ICarrier {
  id: string;
  userId: string;
  name: string;
  endpoints: IEndpoint[];
  steps?: IStep[];
}

export interface IEndpoint {
  name: string;
  url: string;
  query: IQuery;
}

export interface IQuery {
  method: 'POST' | 'GET';
  params?: IParam[];
  auth?: IAuth;
  header?: IHeader[];
  body?: IBody;
}

export interface IParam {
  name?: string;
  value?: string;
}

export interface IAuth {
  type?: 'basic' | 'bearer';
  value?: string;
}

export interface IHeader {
  name?: string;
  value?: string;
}

export interface IBody {
  language?: 'json' | 'xml';
  value?: string;
}

export interface IStepDetails {
  step: number;
  stepTitle: string;
  details1: string;
  details2: string;
  details3: string;
  details4: string;
}

export interface IForm {
  expectedFieldName: string;
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

export interface StepConfig {
  action: (data: any, state: any) => void | Promise<void>;
  message: (state: any) => string | Promise<string>;
  stepsDetails: IStepDetails;
  form: IForm;
  next: string;
}
// End of the Carrier region

// Beginning of the Shipment region
export interface IShipment {
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

export interface IParsingDictionary {
  id: MaybeString;
  carrier: MaybeString;
  dictionary: Array<{ key: string; value: string }>;
}
// End of the Shipment region

// Auxiliary
export type StepKey =
  | 'step1'
  | 'step2'
  | 'step3'
  | 'step4'
  | 'step5'
  | 'step6'
  | 'step7'
  | 'step8'
  | 'step9'
  | 'step10';
