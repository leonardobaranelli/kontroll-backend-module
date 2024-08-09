import ParsingDictionaryService from '../../services/parsing-dictionary.service';
import {
  ParserResult,
  ShipmentInput,
} from '../../utils/types/utilities.interface';
import { IShipmentContent } from '../../utils/types/models.interface';
import {
  formatShipmentData,
  getValueByPath,
  setValueByPath,
  findScheduledDates,
  ensureRequiredFields,
} from './utils/formattingUtils';

interface MappingDictionary {
  [key: string]: string;
}

export async function getMappingDictionaryByCarrier(
  carrier: string,
): Promise<MappingDictionary> {
  console.log(`Fetching mapping dictionary for carrier: ${carrier}`);

  try {
    const parsingDictionary =
      await ParsingDictionaryService.getParsingDictionaryByCarrier(carrier);

    if (!parsingDictionary || !parsingDictionary.dictionary) {
      throw new Error(`Mapping dictionary for carrier ${carrier} not found`);
    }

    console.log(
      `Mapping dictionary fetched: ${JSON.stringify(
        parsingDictionary.dictionary,
      )}`,
    );
    return Object.fromEntries(
      parsingDictionary.dictionary.map(
        (item: { key: string; value: string }) => [item.key, item.value],
      ),
    );
  } catch (error) {
    console.error(
      `Error fetching mapping dictionary for carrier ${carrier}:`,
      error,
    );
    throw error;
  }
}

async function parseShipmentWithMapping(
  inputJson: ShipmentInput,
  carrier: string,
): Promise<IShipmentContent> {
  console.log('Starting parseShipmentWithMapping');
  const mappingDictionary = await getMappingDictionaryByCarrier(carrier);
  const parsedData: Partial<IShipmentContent> = {};

  console.log('Input JSON:', JSON.stringify(inputJson, null, 2));
  console.log(
    'Mapping Dictionary:',
    JSON.stringify(mappingDictionary, null, 2),
  );

  for (const [inputPath, outputPath] of Object.entries(mappingDictionary)) {
    const value = getValueByPath(inputJson, inputPath);
    console.log(`Mapping ${inputPath} to ${outputPath}. Value:`, value);

    if (outputPath.startsWith('Timestamp')) {
      // Handle Timestamp field specially
      if (!parsedData.Timestamp) parsedData.Timestamp = [];
      if (Array.isArray(value)) {
        parsedData.Timestamp.push(
          ...value.map((item: any) => ({
            TimestampCode: item.statusCode || null,
            TimestampDescription: item.status || null,
            TimestampDateTime: item.timestamp || null,
            TimestampLocation: item.location?.address?.addressLocality || null,
          })),
        );
      } else if (value) {
        parsedData.Timestamp.push({
          TimestampCode: value.statusCode || null,
          TimestampDescription: value.status || null,
          TimestampDateTime: value.timestamp || null,
          TimestampLocation: value.location?.address?.addressLocality || null,
        });
      }
    } else if (value !== undefined) {
      setValueByPath(parsedData, outputPath, value);
    }
  }

  console.log('Parsed Data:', JSON.stringify(parsedData, null, 2));

  // Ensure all required fields are present and properly formatted
  const shipment = ensureRequiredFields(parsedData, inputJson);

  console.log('Final shipment object:', JSON.stringify(shipment, null, 2));

  // Try to find ScheduledDeparture and ShipmentDate from Timestamp if not already set
  findScheduledDates(shipment);

  return shipment;
}

export async function parseShipmentWithMemory(
  inputJson: ShipmentInput,
  carrier: string,
): Promise<ParserResult> {
  console.log('Starting parseShipmentWithMemory');
  try {
    if (Object.keys(inputJson).length === 0) {
      throw new Error('Input JSON is empty');
    }
    const parsedData = await parseShipmentWithMapping(inputJson, carrier);
    const formattedData = formatShipmentData(parsedData);

    console.log('Formatted Data:', JSON.stringify(formattedData, null, 2));

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
