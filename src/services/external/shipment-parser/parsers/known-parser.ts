import fs from 'fs';
import path from 'path';
import { ShipmentData, ParserResult, ShipmentInput } from '../types';

interface MappingDictionary {
  [key: string]: string;
}

function loadMappingDictionary(): MappingDictionary {
  const filePath = path.join(__dirname, '..', 'mappingDictionary.json');
  const rawData = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(rawData);
}

function parseShipmentWithMapping(inputJson: ShipmentInput): ShipmentData {
  const mappingDictionary = loadMappingDictionary();
  const parsedData: Partial<ShipmentData> = {};

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
  return parsedData as ShipmentData;
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

export async function parseShipment(
  inputJson: ShipmentInput,
): Promise<ParserResult> {
  try {
    if (Object.keys(inputJson).length === 0) {
      throw new Error('Input JSON is empty');
    }

    const parsedData = parseShipmentWithMapping(inputJson);

    return {
      success: true,
      data: parsedData,
    };
  } catch (error: any) {
    console.error('Error parsing shipment:', error);
    return {
      success: false,
      error: `Error parsing shipment: ${error.message}`,
    };
  }
}
