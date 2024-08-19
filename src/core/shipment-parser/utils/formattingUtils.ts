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

export function formatTimestamps(timestamps: any[]): TimestampEntry[] {
  if (!Array.isArray(timestamps)) {
    return [];
  }

  return timestamps.map((timestamp) => ({
    ...timestamp,
    TimestampDateTime: timestamp.TimestampDateTime
      ? formatDate(timestamp.TimestampDateTime)
      : null,
  }));
}

export function formatShipmentData(
  parsedShipment: Partial<IShipmentContent>,
): IShipmentContent {
  if (!parsedShipment.HousebillNumber) {
    console.warn('HousebillNumber is missing in the parsed shipment data');
  }

  const formattedTimestamp = formatTimestamps(parsedShipment.Timestamp || []);

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
    Timestamp: formattedTimestamp.map((timestamp) => ({
      TimestampCode: timestamp.TimestampCode || null,
      TimestampDescription: timestamp.TimestampDescription || null,
      TimestampDateTime: timestamp.TimestampDateTime || null,
      TimestampLocation: timestamp.TimestampLocation || null,
    })),
    brokerName: parsedShipment.brokerName || null,
    incoterms: parsedShipment.incoterms || null,
    shipmentDate: parsedShipment.shipmentDate
      ? formatDate(parsedShipment.shipmentDate as string)
      : null,
    booking: parsedShipment.booking || null,
    mawb: parsedShipment.mawb || null,
    hawb: parsedShipment.hawb || null,
    flight: parsedShipment.flight || null,
    airportOfDeparture: parsedShipment.airportOfDeparture || null,
    etd: parsedShipment.etd ? formatDate(parsedShipment.etd as string) : null,
    atd: parsedShipment.atd ? formatDate(parsedShipment.atd as string) : null,
    airportOfArrival: parsedShipment.airportOfArrival || null,
    eta: parsedShipment.eta ? formatDate(parsedShipment.eta as string) : null,
    ata: parsedShipment.ata ? formatDate(parsedShipment.ata as string) : null,
    vessel: parsedShipment.vessel || null,
    portOfLoading: parsedShipment.portOfLoading || null,
    mbl: parsedShipment.mbl || null,
    hbl: parsedShipment.hbl || null,
    pickupDate: parsedShipment.pickupDate
      ? formatDate(parsedShipment.pickupDate as string)
      : null,
    containerNumber: parsedShipment.containerNumber || null,
    portOfUnloading: parsedShipment.portOfUnloading || null,
    finalDestination: parsedShipment.finalDestination || null,
    internationalCarrier: parsedShipment.internationalCarrier || null,
    voyage: parsedShipment.voyage || null,
    portOfReceipt: parsedShipment.portOfReceipt || null,
    goodsDescription: parsedShipment.goodsDescription || null,
    containers: parsedShipment.containers || null,
  };

  return formattedShipment;
}

export function removeSpecificNullFields(
  obj: Partial<IShipmentContent>,
): IShipmentContent {
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
  const parts = path.split('.');
  let current = obj;
  for (const part of parts) {
    if (current === null || current === undefined) return undefined;
    const key = Object.keys(current).find(
      (k) => k.toLowerCase() === part.toLowerCase(),
    );
    if (key === undefined) return undefined;
    current = current[key];
  }
  return current;
}

export function setValueByPath(
  obj: any,
  path: string,
  value: any,
  caseInsensitive = false,
) {
  const parts = path.split('.');
  let current = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (caseInsensitive) {
      const key = Object.keys(current).find(
        (k) => k.toLowerCase() === part.toLowerCase(),
      );
      if (!key) {
        current[part] = {};
        current = current[part];
      } else {
        current = current[key];
      }
    } else {
      if (!current[part]) current[part] = {};
      current = current[part];
    }
  }
  const lastPart = parts[parts.length - 1];
  if (caseInsensitive) {
    const key = Object.keys(current).find(
      (k) => k.toLowerCase() === lastPart.toLowerCase(),
    );
    if (key) {
      current[key] = value;
    } else {
      current[lastPart] = value;
    }
  } else {
    current[lastPart] = value;
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
  const result: Partial<IShipmentContent> = {};

  // Merge parsedData and inputJson, giving priority to parsedData
  const mergedData = { ...inputJson, ...parsedData };

  // Iterate through all properties of mergedData
  for (const key in mergedData) {
    if (Object.prototype.hasOwnProperty.call(mergedData, key)) {
      const value = mergedData[key as keyof IShipmentContent];

      if (key === 'Timestamp') {
        // Ensure Timestamp is always an array
        result[key] = Array.isArray(value) ? value : [];
      } else if (typeof value === 'object' && value !== null) {
        // Handle nested objects
        result[key as keyof IShipmentContent] = { ...value } as any;
      } else {
        // Handle primitive values
        result[key as keyof IShipmentContent] = value as any;
      }
    }
  }

  // Ensure HousebillNumber is present (it's a required field)
  if (!result.HousebillNumber) {
    result.HousebillNumber = inputJson.ShipmentId || '';
  }

  return result as IShipmentContent;
}
