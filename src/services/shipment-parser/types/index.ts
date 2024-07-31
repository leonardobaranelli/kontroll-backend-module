export interface ShipmentInput {
  [key: string]: any;
}

export interface ShipmentData {
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

export interface ParserResult {
  success: boolean;
  data?: ShipmentData;
  error?: string;
}
