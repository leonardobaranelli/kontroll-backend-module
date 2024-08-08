import { IShipment } from '../../../utils/types/models.interface';

interface TimestampEntry {
  TimestampDateTime: string | null;

  [key: string]: any;
}

export function formatShipmentData(
  parsedShipment: Partial<IShipment>,
): IShipment {
  if (!parsedShipment.shipmentContent?.HousebillNumber) {
    console.warn('HousebillNumber is missing in the parsed shipment data');
  }

  let formattedTimestamp: TimestampEntry[] = [];
  if (
    parsedShipment.shipmentContent?.Timestamp &&
    typeof parsedShipment.shipmentContent?.Timestamp === 'object'
  ) {
    formattedTimestamp = Object.entries(
      parsedShipment.shipmentContent?.Timestamp,
    ).map(([, value]) => ({
      ...value,
      TimestampDateTime: value.TimestampDateTime
        ? formatDate(value.TimestampDateTime as string)
        : null,
    }));
  }

  const formattedShipment: IShipment = {
    id: parsedShipment.id || '',
    carrierId: parsedShipment.carrierId || '',
    shipmentContent: {
      HousebillNumber: parsedShipment.shipmentContent?.HousebillNumber || '',
      Origin: parsedShipment.shipmentContent?.Origin || {
        LocationCode: '',
        LocationName: '',
        CountryCode: '',
      },
      Destination: parsedShipment.shipmentContent?.Destination || {
        LocationCode: '',
        LocationName: '',
        CountryCode: '',
      },
      DateAndTimes: {
        ScheduledDeparture: parsedShipment.shipmentContent?.DateAndTimes
          ?.ScheduledDeparture
          ? formatDate(
              parsedShipment.shipmentContent?.DateAndTimes
                .ScheduledDeparture as string,
            )
          : null,
        ScheduledArrival: parsedShipment.shipmentContent?.DateAndTimes
          ?.ScheduledArrival
          ? formatDate(
              parsedShipment.shipmentContent?.DateAndTimes
                .ScheduledArrival as string,
            )
          : null,
        ShipmentDate: parsedShipment.shipmentContent?.DateAndTimes?.ShipmentDate
          ? formatDate(
              parsedShipment.shipmentContent?.DateAndTimes
                .ShipmentDate as string,
            )
          : null,
      },
      ProductType: parsedShipment.shipmentContent?.ProductType || null,
      TotalPackages: parsedShipment.shipmentContent?.TotalPackages || null,
      TotalWeight: parsedShipment.shipmentContent?.TotalWeight || {
        '*body': null,
        '@uom': null,
      },
      TotalVolume: parsedShipment.shipmentContent?.TotalVolume || {
        '*body': null,
        '@uom': null,
      },
      Timestamp: formattedTimestamp,
    },
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
