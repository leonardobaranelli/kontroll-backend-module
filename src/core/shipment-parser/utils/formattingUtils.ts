import { IShipmentContent } from '../../../utils/types/models.interface';
import { ShipmentInput } from '../../../utils/types/utilities.interface';
interface TimestampEntry {
  TimestampDateTime: string | null;
  [key: string]: any;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    console.error(`Invalid date value: ${dateString}`);
    return ''; // Return an empty string or handle it as needed
  }
  return date.toISOString();
}

export function formatShipmentData(
  parsedShipment: Partial<IShipmentContent>,
): IShipmentContent {
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

  const formattedShipment: IShipmentContent = {
    HousebillNumber: parsedShipment.HousebillNumber || '',
    Origin: {
      LocationCode: parsedShipment.Origin?.LocationCode || null,
      LocationName: parsedShipment.Origin?.LocationName || null,
      CountryCode: parsedShipment.Origin?.CountryCode || null,
    },
    Destination: {
      LocationCode: parsedShipment.Destination?.LocationCode || null,
      LocationName: parsedShipment.Destination?.LocationName || null,
      CountryCode: parsedShipment.Destination?.CountryCode || null,
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
    TotalWeight: parsedShipment.TotalWeight || {
      '*body': null,
      '@uom': null,
    },
    TotalVolume: parsedShipment.TotalVolume || {
      '*body': null,
      '@uom': null,
    },
    Timestamp: formattedTimestamp,
    shipmentDate: parsedShipment.shipmentDate || null,
  };

  return formattedShipment;
}

export function removeSpecificNullFields(obj: Partial<IShipmentContent>): IShipmentContent {
  const optionalFields: Array<keyof IShipmentContent> = [
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

  const result: IShipmentContent = {
    HousebillNumber: obj.HousebillNumber || '',
    Origin: obj.Origin || {
      LocationCode: '',
      LocationName: '',
      CountryCode: '',
    },
    Destination: obj.Destination || {
      LocationCode: '',
      LocationName: '',
      CountryCode: '',
    },
    DateAndTimes: obj.DateAndTimes || {
      ScheduledDeparture: null,
      ScheduledArrival: null,
      ShipmentDate: null,
    },
    ProductType: obj.ProductType || null,
    TotalPackages: obj.TotalPackages || null,
    TotalWeight: obj.TotalWeight || {
      '*body': null,
      '@uom': null,
    },
    TotalVolume: obj.TotalVolume || {
      '*body': null,
      '@uom': null,
    },
    Timestamp: obj.Timestamp || [],
    shipmentDate: obj.shipmentDate || null,
  };

  if (!result.HousebillNumber) {
    throw new Error('HousebillNumber is required');
  }

  for (const key of optionalFields) {
    const value = obj[key];
    if (
      value !== null &&
      value !== undefined &&
      value !== '' &&
      !(Array.isArray(value) && value.length === 0)
    ) {
      (result as any)[key] = value;
    }
  }

  return result;
}

export function getValueByPath(obj: any, path: string): any {
  const keys = path.replace(/\[(\w+)\]/g, '.$1').split('.');
  let result = obj;
  for (const key of keys) {
    result = result?.[key];
    if (result === undefined) break;
  }
  return result;
}

export function setValueByPath(obj: any, path: string, value: any): void {
  const keys = path.replace(/\[(\w+)\]/g, '.$1').split('.');
  const lastKey = keys.pop();
  const target = keys.reduce((acc, key) => {
    if (!acc[key] || typeof acc[key] !== 'object') {
      acc[key] = {};
    }
    return acc[key];
  }, obj);
  if (lastKey) {
    target[lastKey] = value;
  }
}

export function findScheduledDates(shipment: any): void {
  if (
    !shipment.DateAndTimes?.ScheduledDeparture ||
    !shipment.DateAndTimes?.ShipmentDate
  ) {
    const sortedTimestamps = shipment.Timestamp?.slice().sort(
      (a: any, b: any) =>
        (a.TimestampDateTime?.toString() || '').localeCompare(
          b.TimestampDateTime?.toString() || '',
        ),
    );

    if (!shipment.DateAndTimes?.ScheduledDeparture) {
      const scheduledDeparture = sortedTimestamps?.find(
        (t: any) => t.TimestampCode === 'pre-transit',
      );
      if (scheduledDeparture) {
        shipment.DateAndTimes!.ScheduledDeparture =
          scheduledDeparture.TimestampDateTime;
      }
    }

    if (!shipment.DateAndTimes?.ShipmentDate) {
      const shipmentDate = sortedTimestamps?.find((t: any) =>
        t.TimestampDescription?.toLowerCase().includes('processed'),
      );
      if (shipmentDate) {
        shipment.DateAndTimes!.ShipmentDate = shipmentDate.TimestampDateTime;
      }
    }
  }
}

export function ensureRequiredFields(
  parsedData: Partial<IShipmentContent>,
  inputJson: ShipmentInput,
): IShipmentContent {
  return {
    HousebillNumber: parsedData.HousebillNumber || '',
    Origin: {
      LocationCode: parsedData.Origin?.LocationCode || null,
      LocationName: parsedData.Origin?.LocationName || '',
      CountryCode: parsedData.Origin?.CountryCode || '',
    },
    Destination: {
      LocationCode: parsedData.Destination?.LocationCode || null,
      LocationName: parsedData.Destination?.LocationName || '',
      CountryCode: parsedData.Destination?.CountryCode || '',
    },
    DateAndTimes: parsedData.DateAndTimes || {
      ScheduledDeparture: null,
      ScheduledArrival: null,
      ShipmentDate: null,
    },
    ProductType: parsedData.ProductType || null,
    TotalPackages: parsedData.TotalPackages || null,
    TotalWeight: parsedData.TotalWeight || {
      '*body': null,
      '@uom': null,
    },
    TotalVolume: parsedData.TotalVolume || {
      '*body': null,
      '@uom': null,
    },
    Timestamp: (
      inputJson.events?.map((event: any) => ({
        TimestampCode: event.statusCode || 'unknown',
        TimestampDescription: event.status || '',
        TimestampDateTime: event.timestamp || null,
        TimestampLocation: event.location?.address?.addressLocality || null,
      })) || []
    ).reverse(), // Reverse the order to match AI parsing
    shipmentDate: parsedData.shipmentDate || null,
    brokerName: parsedData.brokerName || null,
    incoterms: parsedData.incoterms || null,
    booking: parsedData.booking || null,
    mawb: parsedData.mawb || null,
    hawb: parsedData.hawb || null,
    flight: parsedData.flight || null,
    airportOfDeparture: parsedData.airportOfDeparture || null,
    etd: parsedData.etd || null,
    atd: parsedData.atd || null,
    airportOfArrival: parsedData.airportOfArrival || null,
    eta: parsedData.eta || null,
    ata: parsedData.ata || null,
    vessel: parsedData.vessel || null,
    portOfLoading: parsedData.portOfLoading || null,
    mbl: parsedData.mbl || null,
    hbl: parsedData.hbl || null,
    pickupDate: parsedData.pickupDate || null,
    containerNumber: parsedData.containerNumber || null,
    portOfUnloading: parsedData.portOfUnloading || null,
    finalDestination: parsedData.finalDestination || null,
    internationalCarrier: parsedData.internationalCarrier || null,
    voyage: parsedData.voyage || null,
    portOfReceipt: parsedData.portOfReceipt || null,
    goodsDescription: parsedData.goodsDescription || null,
    containers: parsedData.containers || null,
  };
}
