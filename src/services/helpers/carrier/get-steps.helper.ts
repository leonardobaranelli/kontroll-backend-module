import * as fs from 'fs';
import * as path from 'path';

// Load JSON content from a file
const loadJSON = (filePath: string): any => {
  const rawData = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(rawData);
};

// Function to count the number of objects in an array
const countObjectsInArray = (array: any[]): number => {
  if (!Array.isArray(array)) {
    throw new Error('The provided data is not an array.');
  }
  return array.length;
};

// Main
export const carrierStepsData = (carrierName: string) => {
  const formattedCarrierName = carrierName.toLowerCase().replace(/\s+/g, '_');
  const carrierFilePath = path.join(
    `./src/storage/carriers/data-on-steps/${formattedCarrierName}.json`,
  );

  try {
    const dataOnSteps = loadJSON(carrierFilePath);

    const numberOfSteps = countObjectsInArray(dataOnSteps);
    console.log(`Number of steps: ${numberOfSteps}`);

    return { dataOnSteps, numberOfSteps };
  } catch (error) {
    console.error(error);
    throw new Error(`Error loading service configuration for ${carrierName}`);
  }
};
