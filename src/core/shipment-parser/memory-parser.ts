import fs from 'fs';
import path from 'path';
import {
  ParserResult,
  ShipmentInput,
} from '../../utils/types/shipment-parser.interface';
import { IShipment } from '../../utils/types/models.interface';
import { formatShipmentData } from './utils/formatter';

interface MappingDictionary {
  [key: string]: string;
}

function loadMappingDictionary(): MappingDictionary {
  const filePath = path.join(__dirname, '..', '..', 'mappingDictionary.json');
  const rawData = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(rawData);
}

function parseShipmentWithMapping(inputJson: ShipmentInput): IShipment {
  const mappingDictionary = loadMappingDictionary();
  const parsedData: Partial<IShipment> = {};

  console.log('Input JSON:', JSON.stringify(inputJson, null, 2));
  console.log(
    'Mapping Dictionary:',
    JSON.stringify(mappingDictionary, null, 2),
  );

  for (const [inputPath, outputPath] of Object.entries(mappingDictionary)) {
    const value = getValueByPath(inputJson, inputPath);
    console.log(`Mapping ${inputPath} to ${outputPath}. Value:`, value);
    if (value !== undefined) {
      setValueByPath(parsedData, outputPath, value);
    }
  }

  console.log('Parsed Data:', JSON.stringify(parsedData, null, 2));

  // Ensure all required fields are present and properly formatted
  const shipment: IShipment = {
    HousebillNumber: parsedData.HousebillNumber || '',
    Origin: {
      LocationCode: null, // Set to null to match AI parsing
      LocationName: parsedData.Origin?.LocationName || '',
      CountryCode: parsedData.Origin?.CountryCode || '',
    },
    Destination: {
      LocationCode: null, // Set to null to match AI parsing
      LocationName: parsedData.Destination?.LocationName || '',
      CountryCode: parsedData.Destination?.CountryCode || '',
    },
    DateAndTimes: {
      ScheduledDeparture: parsedData.DateAndTimes?.ScheduledDeparture || null,
      ScheduledArrival: parsedData.DateAndTimes?.ScheduledArrival || null,
      ShipmentDate: parsedData.DateAndTimes?.ShipmentDate || null,
    },
    ProductType: parsedData.ProductType || null,
    TotalPackages: parsedData.TotalPackages || null,
    TotalWeight: parsedData.TotalWeight || { '*body': null, '@uom': null },
    TotalVolume: parsedData.TotalVolume || { '*body': null, '@uom': null },
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

  console.log('Final shipment object:', JSON.stringify(shipment, null, 2));

  // Try to find ScheduledDeparture and ShipmentDate from Timestamp if not already set
  if (
    !shipment.DateAndTimes?.ScheduledDeparture ||
    !shipment.DateAndTimes?.ShipmentDate
  ) {
    const sortedTimestamps = shipment.Timestamp?.slice().sort((a, b) =>
      (a.TimestampDateTime?.toString() || '').localeCompare(
        b.TimestampDateTime?.toString() || '',
      ),
    );

    if (!shipment.DateAndTimes?.ScheduledDeparture) {
      const scheduledDeparture = sortedTimestamps?.find(
        (t) => t.TimestampCode === 'pre-transit',
      );
      if (scheduledDeparture) {
        shipment.DateAndTimes!.ScheduledDeparture =
          scheduledDeparture.TimestampDateTime;
      }
    }

    if (!shipment.DateAndTimes?.ShipmentDate) {
      const shipmentDate = sortedTimestamps?.find((t) =>
        t.TimestampDescription?.toLowerCase().includes('processed'),
      );
      if (shipmentDate) {
        shipment.DateAndTimes!.ShipmentDate = shipmentDate.TimestampDateTime;
      }
    }
  }

  return shipment;
}

function getValueByPath(obj: any, path: string): any {
  const keys = path.replace(/\[(\w+)\]/g, '.$1').split('.');
  let result = obj;
  for (const key of keys) {
    result = result?.[key];
    if (result === undefined) break;
  }
  return result;
}

function setValueByPath(obj: any, path: string, value: any): void {
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

export async function parseShipmentWithMemory(
  inputJson: ShipmentInput,
): Promise<ParserResult> {
  try {
    if (Object.keys(inputJson).length === 0) {
      throw new Error('Input JSON is empty');
    }
    const parsedData = parseShipmentWithMapping(inputJson);
    const formattedData = formatShipmentData(parsedData);

    return {
      success: true,
      data: formattedData,
    };
  } catch (error: any) {
    console.error('Error parsing shipment with memory:', error);
    return {
      success: false,
      error: `Error parsing shipment with memory: ${error.message}`,
    };
  }
}
