import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { createLogger } from './loggingUtils';
import ParsingDictionaryService from '../../../services/parsing-dictionary.service';

const filePath = path.join(__dirname, 'mapping_dictionary.json');

const Logger = createLogger('FileUtils');

export async function saveMappingDictionary(
  mapping: Array<{ key: string; value: string }>,
  carrier: string,
) {
  const parsingDictionary = {
    id: uuidv4(),
    carrier: carrier,
    dictionary: Object.fromEntries(
      mapping.map((item) => [item.key, item.value]),
    ),
  };

  try {
    await ParsingDictionaryService.createParsingDictionary({
      carrier: parsingDictionary.carrier,
      dictionary: parsingDictionary.dictionary,
    });
    Logger.info('Parsing dictionary saved successfully');
  } catch (dbError: any) {
    Logger.warn(`Failed to save parsing dictionary: ${dbError.message}`);
  }
}

export function loadMappingDictionary(): Record<string, string> {
  if (!fs.existsSync(filePath)) {
    return {};
  }
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data);
}
