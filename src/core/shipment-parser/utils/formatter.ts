import { IShipment } from '../../../utils/types/models.interface';

interface TimestampEntry {
  TimestampDateTime: string | null;

  [key: string]: any;
}

export function formatShipmentData(
  parsedShipment: Partial<IShipment>,
): IShipment {
  if (!parsedShipment.HousebillNumber) {
    console.warn('HousebillNumber is missing in the parsed shipment data');
  }

  let formattedTimestamp: TimestampEntry[] = [];
  if (
    parsedShipment.Timestamp &&
    typeof parsedShipment.Timestamp === 'object'
  ) {
    formattedTimestamp = Object.entries(parsedShipment.Timestamp).map(
      ([, value]) => ({
        ...value,
        TimestampDateTime: value.TimestampDateTime
          ? formatDate(value.TimestampDateTime as string)
          : null,
      }),
    );
  }

  const formattedShipment: IShipment = {
    HousebillNumber: parsedShipment.HousebillNumber || '',
    Origin: parsedShipment.Origin || {
      LocationCode: '',
      LocationName: '',
      CountryCode: '',
    },
    Destination: parsedShipment.Destination || {
      LocationCode: '',
      LocationName: '',
      CountryCode: '',
    },
    DateAndTimes: {
      ScheduledDeparture: parsedShipment.DateAndTimes?.ScheduledDeparture
        ? formatDate(parsedShipment.DateAndTimes.ScheduledDeparture as string)
        : null,
      ScheduledArrival: parsedShipment.DateAndTimes?.ScheduledArrival
        ? formatDate(parsedShipment.DateAndTimes.ScheduledArrival as string)
        : null,
      ShipmentDate: parsedShipment.DateAndTimes?.ShipmentDate
        ? formatDate(parsedShipment.DateAndTimes.ShipmentDate as string)
        : null,
    },
    ProductType: parsedShipment.ProductType || null,
    TotalPackages: parsedShipment.TotalPackages || null,
    TotalWeight: parsedShipment.TotalWeight || { '*body': null, '@uom': null },
    TotalVolume: parsedShipment.TotalVolume || { '*body': null, '@uom': null },
    Timestamp: formattedTimestamp,
  };

  // Add optional fields only if they are not null
  const optionalFields = [
    'brokerName',
    'incoterms',
    'shipmentDate',
    'booking',
    'mawb',
    'hawb',
    'flight',
    'airportOfDeparture',
    'etd',
    'atd',
    'airportOfArrival',
    'eta',
    'ata',
    'vessel',
    'portOfLoading',
    'mbl',
    'hbl',
    'pickupDate',
    'containerNumber',
    'portOfUnloading',
    'finalDestination',
    'internationalCarrier',
    'voyage',
    'portOfReceipt',
    'goodsDescription',
    'containers',
  ];

  for (const field of optionalFields) {
    if (
      field in parsedShipment &&
      parsedShipment[field as keyof IShipment] != null
    ) {
      (formattedShipment as any)[field] =
        parsedShipment[field as keyof IShipment];
    }
  }

  return formattedShipment;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toISOString();
}
