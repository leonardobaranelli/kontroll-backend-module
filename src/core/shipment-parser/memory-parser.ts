import fs from 'fs';
import path from 'path';
import {
  ParserResult,
  ShipmentInput,
} from '../../utils/types/utilities.interface';
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
    id: parsedData.id || '',
    carrierId: parsedData.carrierId || '',
    shipmentContent: {
      HousebillNumber: parsedData.shipmentContent?.HousebillNumber || '',
      Origin: {
        LocationCode: null, // Set to null to match AI parsing
        LocationName: parsedData.shipmentContent?.Origin?.LocationName || '',
        CountryCode: parsedData.shipmentContent?.Origin?.CountryCode || '',
      },
      Destination: {
        LocationCode: null, // Set to null to match AI parsing
        LocationName:
          parsedData.shipmentContent?.Destination?.LocationName || '',
        CountryCode: parsedData.shipmentContent?.Destination?.CountryCode || '',
      },
      DateAndTimes: {
        ScheduledDeparture:
          parsedData.shipmentContent?.DateAndTimes?.ScheduledDeparture || null,
        ScheduledArrival:
          parsedData.shipmentContent?.DateAndTimes?.ScheduledArrival || null,
        ShipmentDate:
          parsedData.shipmentContent?.DateAndTimes?.ShipmentDate || null,
      },
      ProductType: parsedData.shipmentContent?.ProductType || null,
      TotalPackages: parsedData.shipmentContent?.TotalPackages || null,
      TotalWeight: parsedData.shipmentContent?.TotalWeight || {
        '*body': null,
        '@uom': null,
      },
      TotalVolume: parsedData.shipmentContent?.TotalVolume || {
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
      shipmentDate: parsedData.shipmentContent?.shipmentDate || null,
      brokerName: parsedData.shipmentContent?.brokerName || null,
      incoterms: parsedData.shipmentContent?.incoterms || null,
      booking: parsedData.shipmentContent?.booking || null,
      mawb: parsedData.shipmentContent?.mawb || null,
      hawb: parsedData.shipmentContent?.hawb || null,
      flight: parsedData.shipmentContent?.flight || null,
      airportOfDeparture:
        parsedData.shipmentContent?.airportOfDeparture || null,
      etd: parsedData.shipmentContent?.etd || null,
      atd: parsedData.shipmentContent?.atd || null,
      airportOfArrival: parsedData.shipmentContent?.airportOfArrival || null,
      eta: parsedData.shipmentContent?.eta || null,
      ata: parsedData.shipmentContent?.ata || null,
      vessel: parsedData.shipmentContent?.vessel || null,
      portOfLoading: parsedData.shipmentContent?.portOfLoading || null,
      mbl: parsedData.shipmentContent?.mbl || null,
      hbl: parsedData.shipmentContent?.hbl || null,
      pickupDate: parsedData.shipmentContent?.pickupDate || null,
      containerNumber: parsedData.shipmentContent?.containerNumber || null,
      portOfUnloading: parsedData.shipmentContent?.portOfUnloading || null,
      finalDestination: parsedData.shipmentContent?.finalDestination || null,
      internationalCarrier:
        parsedData.shipmentContent?.internationalCarrier || null,
      voyage: parsedData.shipmentContent?.voyage || null,
      portOfReceipt: parsedData.shipmentContent?.portOfReceipt || null,
      goodsDescription: parsedData.shipmentContent?.goodsDescription || null,
      containers: parsedData.shipmentContent?.containers || null,
    },
  };

  console.log('Final shipment object:', JSON.stringify(shipment, null, 2));

  // Try to find ScheduledDeparture and ShipmentDate from Timestamp if not already set
  if (
    !shipment.shipmentContent?.DateAndTimes?.ScheduledDeparture ||
    !shipment.shipmentContent?.DateAndTimes?.ShipmentDate
  ) {
    const sortedTimestamps = shipment.shipmentContent?.Timestamp?.slice().sort(
      (a, b) =>
        (a.TimestampDateTime?.toString() || '').localeCompare(
          b.TimestampDateTime?.toString() || '',
        ),
    );

    if (!shipment.shipmentContent?.DateAndTimes?.ScheduledDeparture) {
      const scheduledDeparture = sortedTimestamps?.find(
        (t) => t.TimestampCode === 'pre-transit',
      );
      if (scheduledDeparture) {
        shipment.shipmentContent!.DateAndTimes!.ScheduledDeparture =
          scheduledDeparture.TimestampDateTime;
      }
    }

    if (!shipment.shipmentContent?.DateAndTimes?.ShipmentDate) {
      const shipmentDate = sortedTimestamps?.find((t) =>
        t.TimestampDescription?.toLowerCase().includes('processed'),
      );
      if (shipmentDate) {
        shipment.shipmentContent!.DateAndTimes!.ShipmentDate =
          shipmentDate.TimestampDateTime;
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
