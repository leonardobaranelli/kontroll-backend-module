import { carrierStepsData } from './get-steps';
import { generateCarrierSteps } from './carrier-config';

// Function called from the services layer
export const loadCarrierData = async (carrierName: string) => {
  const { dataOnSteps, numberOfSteps } = await carrierStepsData(carrierName);
  return {
    carrierConfig: generateCarrierSteps(numberOfSteps, dataOnSteps),
    numberOfSteps,
  };
};
