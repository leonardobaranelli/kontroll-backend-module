import _ from 'lodash';
import ParsingDictionaryService from '../../services/parsing-dictionary.service';
import { ShipmentInput } from '../../utils/types/utilities.interface';
import { IShipmentContent } from '../../utils/types/models.interface';
import { createLogger, LogLevel } from './utils/loggingUtils';
import {
  formatShipmentData,
  removeSpecificNullFields,
} from './utils/formattingUtils';
import { ParserResult } from '../../utils/types/utilities.interface';

interface ExtendedParserResult extends ParserResult {
  validationErrors: string[];
}

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
  try {
    const response =
      await ParsingDictionaryService.getParsingDictionaryByCarrier(carrier);
    if (!response) {
      throw new ParsingError(`No response received for carrier: ${carrier}`);
    }
    const dictionary = response.dictionary;
    Logger.info(
      `Fetched dictionary for carrier ${carrier}: ${JSON.stringify(
        dictionary,
      )}`,
    );
    if (!dictionary) {
      throw new ParsingError(
        `No mapping dictionary found for carrier: ${carrier}`,
      );
    }
    // Ensure dictionary is in the correct format
    if (
      Array.isArray(dictionary) &&
      dictionary.every((item) => item.key && item.value)
    ) {
      return dictionary.map((item: { key: string; value: string }) => ({
        key: item.key,
        value: item.value,
      }));
    } else {
      Logger.error(
        `Invalid dictionary format for carrier: ${carrier}: ${JSON.stringify(
          dictionary,
        )}`,
      );
      throw new ParsingError(
        `Invalid dictionary format for carrier: ${carrier}`,
      );
    }
  } catch (error) {
    Logger.error(
      `Error fetching mapping dictionary for carrier ${carrier}: ${
        (error as Error).message
      }`,
    );
    throw error;
  }
}

function handleOptionalFields(
  parsedData: Partial<IShipmentContent>,
  inputJson: ShipmentInput,
) {
  if (!parsedData.TotalPackages) {
    parsedData.TotalPackages = inputJson.details?.references?.length || 0;
  }

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

  optionalFields.forEach((field) => {
    if (!parsedData[field]) {
      parsedData[field] = inputJson[field] || null;
    }
  });
}

export function parseShipmentData(
  parsedData: any,
  mappingDictionary: Array<{ key: string; value: string }>,
): IShipmentContent {
  const shipmentContent: IShipmentContent = {} as IShipmentContent;
  const missingKeys: string[] = [];

  // Initialize optional fields with null values
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

  optionalFields.forEach((field) => {
    if (field in shipmentContent) {
      (shipmentContent as any)[field] = null;
    }
  });

  console.log('shipmentContent before parsing:', shipmentContent);

  mappingDictionary.forEach(({ key, value }) => {
    if (key === 'null') {
      Logger.warn(`Invalid key 'null' found in mapping dictionary`);
      return;
    }

    const parsedValue = _.get(parsedData, key, null);
    if (parsedValue === null) {
      Logger.warn(`Key ${key} not found in parsed data`);
      missingKeys.push(key);
    } else {
      Logger.info(
        `Mapping key ${key} to value ${value} with data ${parsedValue}`,
      );
    }
    _.set(shipmentContent, value, parsedValue);
  });

  if (missingKeys.length > 0) {
    Logger.warn(`Missing keys from parsed data: ${missingKeys.join(', ')}`);
  }

  handleOptionalFields(shipmentContent, parsedData);

  return shipmentContent; // Added this line
}

export async function parseShipmentWithMemory(
  inputJson: ShipmentInput,
  carrier: string,
): Promise<ExtendedParserResult> {
  try {
    const mappingDictionary = await getMappingDictionaryByCarrier(carrier);
    let parsedData = parseShipmentData(inputJson, mappingDictionary);

    handleOptionalFields(parsedData, inputJson);

    const formattedData = formatShipmentData(parsedData);
    const cleanedData = removeSpecificNullFields(formattedData);

    console.log('Parsed shipment data:', cleanedData);
    return {
      success: true,
      data: cleanedData,
      validationErrors: [],
    };
  } catch (error) {
    Logger.error(`Error in parseShipmentWithMemory: ${error}`);
    return {
      success: false,
      error: `Failed to parse shipment: ${error}`,
      validationErrors: [],
    };
  }
}

Logger.setLogLevel(LogLevel.INFO);
