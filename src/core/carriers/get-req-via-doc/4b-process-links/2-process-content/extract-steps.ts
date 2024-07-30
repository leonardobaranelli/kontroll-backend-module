import * as fs from 'fs';
import axios from 'axios';
import { promisify } from 'util';
import * as path from 'path';

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

// Define interfaces
interface StepDetails {
  step: number;
  stepTitle: string;
  details1: string;
  details2: string;
  details3: string;
  details4: string;
}

interface StepObject {
  keyword: string;
  stepsDetails: StepDetails;
  form: {
    instruction: string;
    label: string;
    expectedFieldName: string;
    title: string;
    placeholder: string;
  };
}

type StepsMap = { [keyword: string]: StepObject };

const lightOrange = (text: string) => `\u001b[38;5;214m${text}\u001b[39m`;
const lightRed = (text: string) => `\u001b[38;5;203m${text}\u001b[39m`;

// Function to clean and format content
function cleanAndFormatContent(content: string): string {
  let cleanedContent = content.replace(/\n/g, ' '); // Remove newlines
  cleanedContent = cleanedContent.trim(); // Trim whitespace from start and end
  cleanedContent = cleanedContent.replace(/\s+/g, ' '); // Remove extra spaces between words
  return cleanedContent.toLowerCase(); // Convert to lowercase
}

// Function to extract steps and forms
async function _extractSteps(
  fileName: string,
  content: string,
  contentKeywords: string[],
): Promise<StepObject[]> {
  const stepsMap: StepsMap = {};

  try {
    // Send the cleaned content to the Flask server for analysis
    const response = await axios.post('http://127.0.0.1:5000/analyze', {
      content: content,
      contentKeywords: contentKeywords,
    });

    const entities = response.data;

    for (const entity of entities) {
      if (entity && entity.keyword) {
        if (!stepsMap[entity.keyword]) {
          stepsMap[entity.keyword] = {
            keyword: entity.keyword,
            stepsDetails: {
              step: Object.keys(stepsMap).length + 1,
              stepTitle: `How to find your ${entity.keyword}`,
              details1: '',
              details2: '',
              details3: '',
              details4: '',
            },
            form: {
              instruction: `Provide your ${entity.keyword}.`,
              label: `${
                entity.keyword.charAt(0).toUpperCase() + entity.keyword.slice(1)
              }`,
              expectedFieldName: entity.keyword.replace(/ /g, '').toLowerCase(),
              title: `Enter your ${entity.keyword}`,
              placeholder: 'Text',
            },
          };
        }

        if (entity.stepsDetails) {
          for (let i = 1; i <= 4; i++) {
            const key = `details${i}` as keyof StepDetails;
            if (entity.stepsDetails[key]) {
              stepsMap[entity.keyword].stepsDetails[key] = entity.stepsDetails[
                key
              ] as never;
            }
          }
        }
      }
    }

    return Object.values(stepsMap);
  } catch (error) {
    // Log the error to a file in the logs directory
    const logDirectory =
      './src/core/carriers/get-req-via-doc/logs/errors/4b-process-links';
    if (!fs.existsSync(logDirectory)) {
      fs.mkdirSync(logDirectory, { recursive: true });
    }
    const logFilePath = path.join(logDirectory, `${fileName}_error.log`);
    await writeFileAsync(logFilePath, JSON.stringify(error, null, 2), 'utf-8');

    console.error(lightRed(`Error extracting steps on file ${fileName} `));
    console.error(lightOrange(`Error logged, continuing with the process...`));
    return []; // Return an empty array in case of an error
  }
}

// Main (interact with spacy nlp server)
export async function extractSteps(
  serviceName: string,
  contentKeywords: string[],
): Promise<void> {
  try {
    const formattedServiceName = serviceName.toLowerCase().replace(/\s+/g, '_');
    const directoryPath = `./src/core/carriers/get-req-via-doc/4b-process-links/1-extract-content-from-scraped-links/extracted-content/${formattedServiceName}`;

    const jsonFiles = fs
      .readdirSync(directoryPath)
      .filter((file) => file.endsWith('.json'));

    const outputDirectory = `./src/core/carriers/get-req-via-doc/4b-process-links/2-process-content/extracted-steps/${formattedServiceName}`;
    if (!fs.existsSync(outputDirectory)) {
      fs.mkdirSync(outputDirectory);
    }

    for (const jsonFile of jsonFiles) {
      const filePath = path.join(directoryPath, jsonFile);
      const fileName = path.basename(filePath);
      const jsonData = await readFileAsync(filePath, 'utf-8');
      const jsonContent = JSON.parse(jsonData);

      const content = jsonContent.content;

      const cleanedContent = cleanAndFormatContent(content);

      try {
        const steps = await _extractSteps(
          fileName,
          cleanedContent,
          contentKeywords,
        );

        const outputFileName = `${path.basename(
          jsonFile,
          '.json',
        )}_extractedSteps.json`;
        const outputFilePath = path.join(outputDirectory, outputFileName);

        await writeFileAsync(
          outputFilePath,
          JSON.stringify(steps, null, 2),
          'utf-8',
        );
      } catch (error) {
        console.error(`Error processing file ${jsonFile}:`, error);
      }
    }
  } catch (error) {
    console.error('Error processing:', error);
  }
}
