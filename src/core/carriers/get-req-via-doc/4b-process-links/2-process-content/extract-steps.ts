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

// Function to clean and format content
function cleanAndFormatContent(content: string): string {
  let cleanedContent = content.replace(/\n/g, ' '); // Remove newlines
  cleanedContent = cleanedContent.trim(); // Trim whitespace from start and end
  cleanedContent = cleanedContent.replace(/\s+/g, ' '); // Remove extra spaces between words
  return cleanedContent.toLowerCase(); // Convert to lowercase
}

// Function to extract steps and forms
async function _extractSteps(
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
    console.error('Error extracting steps:', error);
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
      const jsonData = await readFileAsync(filePath, 'utf-8');
      const jsonContent = JSON.parse(jsonData);

      const content = jsonContent.content;

      const cleanedContent = cleanAndFormatContent(content);

      try {
        const steps = await _extractSteps(cleanedContent, contentKeywords);

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
