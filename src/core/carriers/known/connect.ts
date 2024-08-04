import * as fs from 'fs';
import * as path from 'path';

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

// Main function
export const getKnownCarrierStepsData = async (carrierName: string) => {
  const formattedCarrierName = carrierName.toLowerCase().replace(/\s+/g, '_');
  const carrierFilePath = path.join(
    `./src/storage/carriers/known/${formattedCarrierName}.json`,
  );

  try {
    const dataOnSteps = await loadJSON(carrierFilePath);
    if (dataOnSteps === 'Data not found on the storage') {
      throw new Error(`Data for ${carrierName} not found on the storage`);
    }

    const numberOfSteps = await countObjectsInArray(dataOnSteps);

    return {
      dataOnSteps: dataOnSteps.slice(1),
      numberOfSteps,
      requeriments: dataOnSteps[0],
    };
  } catch (error) {
    console.error(error);
    throw new Error(`Error loading service configuration for ${carrierName}`);
  }
};
