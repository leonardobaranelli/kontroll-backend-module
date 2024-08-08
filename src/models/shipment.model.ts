import { IShipment } from '../utils/types/models.interface';

type MaybeString = string | null;
type MaybeNumber = number | null;
type MaybeDate = Date | string | null;

export class Shipment implements IShipment {
  id!: string;
  carrierId!: string;
  shipmentContent!: {
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
  };
}
