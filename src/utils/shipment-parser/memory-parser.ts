import fs from 'fs';
import path from 'path';
import {
  ParserResult,
  ShipmentInput,
} from '../../utils/types/shipment-parser.interface';
import { IShipment } from '../../utils/types/models.interface';

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

  // Ensure all required fields are present
  const shipment: IShipment = {
    HousebillNumber: parsedData.HousebillNumber || '',
    Origin: parsedData.Origin || {
      LocationCode: '',
      LocationName: '',
      CountryCode: '',
    },
    Destination: parsedData.Destination || {
      LocationCode: '',
      LocationName: '',
      CountryCode: '',
    },
    DateAndTimes: parsedData.DateAndTimes || {
      ScheduledDeparture: null,
      ScheduledArrival: null,
      ShipmentDate: null,
    },
    ProductType: parsedData.ProductType || null,
    TotalPackages: parsedData.TotalPackages || null,
    TotalWeight: parsedData.TotalWeight || { '*body': null, '@uom': null },
    TotalVolume: parsedData.TotalVolume || { '*body': null, '@uom': null },
    Timestamp: parsedData.Timestamp || [],
    brokerName: parsedData.brokerName || null,
    incoterms: parsedData.incoterms || null,
    shipmentDate: parsedData.shipmentDate || null,
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

function generateMappingDictionary(inputJson: any, parsedData: any): any {
  const mapping: any = {};

  function findMatchingValues(
    input: any,
    output: any,
    inputPath: string = '',
    outputPath: string = '',
  ) {
    if (Array.isArray(input)) {
      input.forEach((item, index) => {
        findMatchingValues(item, output, `${inputPath}[${index}]`, outputPath);
      });
    } else if (typeof input === 'object' && input !== null) {
      for (const key in input) {
        const newInputPath = inputPath ? `${inputPath}.${key}` : key;
        if (typeof input[key] === 'object' && input[key] !== null) {
          findMatchingValues(input[key], output, newInputPath, outputPath);
        } else {
          findValueInOutput(input[key], output, newInputPath, outputPath);
        }
      }
    }
  }

  function findValueInOutput(
    value: any,
    output: any,
    inputPath: string,
    outputPath: string = '',
  ) {
    if (Array.isArray(output)) {
      output.forEach((item, index) => {
        findValueInOutput(value, item, inputPath, `${outputPath}[${index}]`);
      });
    } else if (typeof output === 'object' && output !== null) {
      for (const key in output) {
        const newOutputPath = outputPath ? `${outputPath}.${key}` : key;
        if (output[key] === value) {
          console.log(`Debug: Match found: ${inputPath} -> ${newOutputPath}`);
          mapping[inputPath] = newOutputPath;
        }
        if (typeof output[key] === 'object' && output[key] !== null) {
          findValueInOutput(value, output[key], inputPath, newOutputPath);
        }
      }
    }
  }

  findMatchingValues(inputJson, parsedData);
  console.log(`Debug: Final mapping:`, mapping);
  return mapping;
}

function saveMappingDictionary(mapping: any) {
  const filePath = path.join(__dirname, '..', '..', 'mappingDictionary.json');
  fs.writeFileSync(filePath, JSON.stringify(mapping, null, 2));
  console.log(`Mapping dictionary saved to ${filePath}`);
}

import { formatShipmentData } from './formatter';

export async function parseShipment(
  inputJson: ShipmentInput,
): Promise<ParserResult> {
  try {
    if (Object.keys(inputJson).length === 0) {
      throw new Error('Input JSON is empty');
    }
    const parsedData = parseShipmentWithMapping(inputJson);
    const formattedData = formatShipmentData(parsedData);

    // Generate and save the mapping dictionary
    console.log(
      '\n\n--------------------------------------------------------------------------------',
    );
    console.log('Generating mapping dictionary...');
    console.log(
      '--------------------------------------------------------------------------------\n\n',
    );
    const mappingDictionary = generateMappingDictionary(
      inputJson,
      formattedData,
    );
    saveMappingDictionary(mappingDictionary);

    return {
      success: true,
      data: formattedData,
    };
  } catch (error: any) {
    console.error('Error parsing shipment:', error);
    return {
      success: false,
      error: `Error parsing shipment: ${error.message}`,
    };
  }
}
