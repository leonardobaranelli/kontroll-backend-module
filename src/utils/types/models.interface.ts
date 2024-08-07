type MaybeString = string | null;
type MaybeNumber = number | null;
type MaybeDate = Date | string | null;

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

export interface ICarrier {
  id: MaybeString;
  name: string;
  url: string;
  memoryParser?: {};
}

// Beginning of the Step region
export interface StepConfig {
  action: (data: any, state: any) => void | Promise<void>;
  message: (state: any) => string | Promise<string>;
  stepsDetails: IStepDetails;
  form: IForm;
  next: string;
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

export type StepKey =
  | 'step1'
  | 'step2'
  | 'step3'
  | 'step4'
  | 'step5'
  | 'step6'
  | 'step7'
  | 'step8';
// End of the Step region
