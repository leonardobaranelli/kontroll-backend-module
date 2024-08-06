import * as fs from 'fs';
import * as path from 'path';
import { getReqViaDoc } from '../../../core/carriers/get-req-via-doc';

const lightRed = (text: string) => `\u001b[38;5;203m${text}\u001b[39m`;

// Load JSON content from a file
const loadJSON = (filePath: string): any => {
  try {
    const rawData = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(rawData);
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return 'Data not found on the storage';
    }
    throw error;
  }
};

// Function to count the number of objects in an array
const countObjectsInArray = (array: any[]): number => {
  if (!Array.isArray(array)) {
    throw new Error(lightRed('The provided data is not an array.'));
  }
  return array.length;
};

// Main
export const carrierStepsData = async (carrierName: string) => {
  const formattedCarrierName = carrierName.toLowerCase().replace(/\s+/g, '_');
  const carrierFilePath = path.join(
    `./src/storage/carriers/data-on-steps/${formattedCarrierName}.json`,
  );

  try {
    const dataOnSteps = await loadJSON(carrierFilePath);
    if (dataOnSteps === 'Data not found on the storage') {
      await getReqViaDoc(carrierName, linksKeywords, contentKeywords);
      const dataOnSteps = await loadJSON(carrierFilePath);
      const numberOfSteps = await countObjectsInArray(dataOnSteps);
      return { dataOnSteps, numberOfSteps };
    } else {
      const numberOfSteps = await countObjectsInArray(dataOnSteps);
      return { dataOnSteps, numberOfSteps };
    }
  } catch (error) {
    console.error(error);
    throw new Error(`Error loading service configuration for ${carrierName}`);
  }
};

const contentKeywords = [
  'api key',
  'apik',
  'auth',
  'account number',
  'client number',
  'customer number',
  'credential',
  'endpoint',
];

const linksKeywords = [
  'doc',
  'customer',
  'client',
  'requirements',
  'service',
  'manual',
  'guide',
  'reference',
  'help',
];