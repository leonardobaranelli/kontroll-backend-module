import ParsingDictionaryService from '../../services/parsing-dictionary.service';
import {
  ParserResult,
  ShipmentInput,
} from '../../utils/types/utilities.interface';
import { IShipmentContent } from '../../utils/types/models.interface';
import { formatShipmentData } from './utils/formattingUtils';
import { createLogger, LogLevel } from './utils/loggingUtils';
import { validateParsedShipmentContent } from './validator/shipment-content.validator';

const Logger = createLogger('MemoryParser');
class ParsingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ParsingError';
  }
}

export async function getMappingDictionaryByCarrier(
  carrier: string,
): Promise<Array<{ key: string; value: string }>> {
  Logger.info(`Fetching mapping dictionary for carrier: ${carrier}`);

  try {
    const parsingDictionary =
      await ParsingDictionaryService.getParsingDictionaryByCarrier(carrier);

    if (!parsingDictionary || !parsingDictionary.dictionary) {
      throw new ParsingError(
        `Mapping dictionary for carrier ${carrier} not found`,
      );
    }

    Logger.debug(
      `Mapping dictionary fetched: ${JSON.stringify(
        parsingDictionary.dictionary,
      )}`,
    );
    return parsingDictionary.dictionary;
  } catch (error) {
    Logger.error(
      `Error fetching mapping dictionary for carrier ${carrier}: ${error}`,
    );
    throw error;
  }
}

async function parseShipmentWithMapping(
  inputJson: ShipmentInput,
  carrier: string,
): Promise<IShipmentContent> {
  Logger.info('Starting parseShipmentWithMapping');
  const mappingDictionary = await getMappingDictionaryByCarrier(carrier);
  const parsedData: Partial<IShipmentContent> = {};

  Logger.debug(`Input JSON: ${JSON.stringify(inputJson)}`);
  Logger.debug(`Mapping Dictionary: ${JSON.stringify(mappingDictionary)}`);

  for (const { value: inputPath, key: outputPath } of mappingDictionary) {
    if (!inputPath) continue;

    const value = getValueByPath(inputJson, inputPath);
    Logger.debug(
      `Mapping ${inputPath} to ${outputPath}. Value: ${JSON.stringify(value)}`,
    );

    if (value !== undefined) {
      setValueByPath(parsedData, outputPath, value, true);
    }
  }

  ensureRequiredFields(parsedData, inputJson);
  handleOptionalFields(parsedData, inputJson);

  Logger.debug(`Parsed Data: ${JSON.stringify(parsedData)}`);

  return parsedData as IShipmentContent;
}

function setValueByPath(
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

function getValueByPath(obj: any, path: string): any {
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

function handleOptionalFields(
  parsedData: Partial<IShipmentContent>,
  inputJson: ShipmentInput,
) {
  const optionalFields = [
    'brokerName',
    'incoterms',
    'booking',
    'etd',
    'atd',
    'eta',
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

  optionalFields.forEach((field) => {
    const key = Object.keys(inputJson).find(
      (k) => k.toLowerCase() === field.toLowerCase(),
    );
    if (key && inputJson[key] !== undefined) {
      setValueByPath(parsedData, field, inputJson[key], true);
    }
  });

  // Ensure HousebillNumber is set
  if (!parsedData.HousebillNumber) {
    const hblKey = Object.keys(inputJson).find(
      (k) => k.toLowerCase() === 'hbl',
    );
    const shipmentIdKey = Object.keys(inputJson).find(
      (k) => k.toLowerCase() === 'shipmentid',
    );
    parsedData.HousebillNumber =
      (hblKey && inputJson[hblKey]) ||
      (shipmentIdKey && inputJson[shipmentIdKey]) ||
      '';
  }
}

function ensureRequiredFields(
  parsedData: Partial<IShipmentContent>,
  inputJson: ShipmentInput,
) {
  parsedData.HousebillNumber =
    parsedData.HousebillNumber || inputJson.hbl || inputJson.ShipmentId || '';
  // Convert TotalPackages to number
  if (
    parsedData.TotalPackages &&
    typeof parsedData.TotalPackages === 'string'
  ) {
    parsedData.TotalPackages = Number(parsedData.TotalPackages);
  }
  // Convert TotalWeight and TotalVolume to numbers
  if (
    parsedData.TotalWeight &&
    typeof parsedData.TotalWeight['*body'] === 'string'
  ) {
    parsedData.TotalWeight['*body'] = Number(parsedData.TotalWeight['*body']);
  }
  if (
    parsedData.TotalVolume &&
    typeof parsedData.TotalVolume['*body'] === 'string'
  ) {
    parsedData.TotalVolume['*body'] = Number(parsedData.TotalVolume['*body']);
  }
  parsedData.Origin = parsedData.Origin || {
    LocationCode: null,
    LocationName: null,
    CountryCode: null,
  };
  parsedData.Destination = parsedData.Destination || {
    LocationCode: null,
    LocationName: null,
    CountryCode: null,
  };
  parsedData.DateAndTimes = parsedData.DateAndTimes || {
    ScheduledDeparture: null,
    ScheduledArrival: null,
    ShipmentDate: null,
  };
  parsedData.ProductType = parsedData.ProductType || inputJson.UnitType || null;
  parsedData.TotalWeight = parsedData.TotalWeight || {
    '*body': null,
    '@uom': 'KG',
  };
  parsedData.TotalVolume = parsedData.TotalVolume || {
    '*body': null,
    '@uom': null,
  };
  parsedData.Timestamp = parsedData.Timestamp || [];

  if (parsedData.Timestamp.length === 0) {
    parsedData.Timestamp.push({
      TimestampCode: 'PU',
      TimestampDescription: 'Shipment picked up from the origin',
      TimestampDateTime: inputJson.PickedupDate || null,
      TimestampLocation: inputJson.PickupPlace || null,
    });
  }
}

// Update the ParserResult type
interface ExtendedParserResult extends ParserResult {
  validationErrors?: string[];
}

export async function parseShipmentWithMemory(
  inputJson: ShipmentInput,
  carrier: string,
): Promise<ExtendedParserResult> {
  Logger.info('Starting parseShipmentWithMemory');
  try {
    if (Object.keys(inputJson).length === 0) {
      throw new ParsingError('Input JSON is empty');
    }
    const parsedData = await parseShipmentWithMapping(inputJson, carrier);
    const formattedData = formatShipmentData(parsedData);

    Logger.debug(`Formatted Data: ${JSON.stringify(formattedData)}`);

    // Validate the parsed data against the standard structure
    const validationResult = validateParsedShipmentContent(formattedData);
    if (
      typeof validationResult === 'object' &&
      !Array.isArray(validationResult)
    ) {
      // Validation passed, no errors
      return {
        success: true,
        data: formattedData,
        validationErrors: [],
      };
    } else if (Array.isArray(validationResult) && validationResult.length > 0) {
      // Validation failed with errors
      Logger.warn(`Validation failed: ${validationResult.join(', ')}`);
      return {
        success: true,
        data: formattedData,
        validationErrors: validationResult,
      };
    }

    return {
      success: true,
      data: formattedData,
      validationErrors: [],
    };
  } catch (error) {
    Logger.error(`Error parsing shipment with memory: ${error}`);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      validationErrors: [],
    };
  }
}

// Set the log level for the module
Logger.setLogLevel(LogLevel.INFO);
