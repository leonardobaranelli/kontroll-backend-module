import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

interface StepsDetails {
  step: number;
  stepTitle: string;
  details1: string;
  details2: string;
  details3: string;
  details4: string;
}

interface FormDetails {
  instruction: string;
  label: string;
  expectedFieldName: string;
  title: string;
  placeholder: string;
}

interface StepInfo {
  keyword: string;
  stepsDetails: StepsDetails;
  form: FormDetails;
}

// Load JSON content from a file
const loadJSON = (filePath: string): any => {
  const rawData = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(rawData);
};

// Function to get the length of all details combined
const getDetailsLength = (step: StepsDetails): number => {
  return (
    step.details1.length +
    step.details2.length +
    step.details3.length +
    step.details4.length
  );
};

// Main function to converge all steps from multiple JSON files into one unique list
export const convergeSteps = async (serviceName: string): Promise<void> => {
  // Create the service folder if it does not exist
  const formattedServiceName = serviceName.toLowerCase().replace(/\s+/g, '_');
  const serviceDir = path.join(
    `./4b-process-links/2-process-content/extracted-steps/${formattedServiceName}`,
  );

  if (!fs.existsSync(serviceDir)) {
    console.error(`Service directory not found: ${serviceDir}`);
    return;
  }

  const outputDir = `../../../storage/carriers/data-on-steps`;
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputFilePath = path.join(outputDir, `${formattedServiceName}.json`);
  const allStepsMap = new Map<string, StepInfo>();

  try {
    const jsonFiles = fs
      .readdirSync(serviceDir)
      .filter((file) => file.endsWith('.json'));

    for (const jsonFile of jsonFiles) {
      const filePath = path.join(serviceDir, jsonFile);
      const stepData: StepInfo[] = loadJSON(filePath);

      for (const step of stepData) {
        const existingStep = allStepsMap.get(step.stepsDetails.stepTitle);
        if (existingStep) {
          if (
            getDetailsLength(step.stepsDetails) >
            getDetailsLength(existingStep.stepsDetails)
          ) {
            allStepsMap.set(step.stepsDetails.stepTitle, step);
          }
        } else {
          allStepsMap.set(step.stepsDetails.stepTitle, step);
        }
      }
    }

    const allSteps = Array.from(allStepsMap.values());

    // Sort and reassign step numbers sequentially
    allSteps.sort((a, b) => a.stepsDetails.step - b.stepsDetails.step);
    allSteps.forEach((step, index) => {
      step.stepsDetails.step = index + 3;
    });

    fs.writeFileSync(
      outputFilePath,
      JSON.stringify(allSteps, null, 2),
      'utf-8',
    );
    console.log(`Steps converged successfully: ${outputFilePath}`);
  } catch (error) {
    console.error('Error during processing:', error);
  }
};
