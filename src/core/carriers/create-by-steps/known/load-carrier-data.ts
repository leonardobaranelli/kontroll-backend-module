import { getKnownCarrierStepsData } from './get-data';
import { generateCarrierSteps } from './carrier-config';

export const loadKnownCarrierData = async (carrierName: string) => {
  const { dataOnSteps, numberOfSteps, requirements } =
    await getKnownCarrierStepsData(carrierName);
  return {
    carrierConfig: generateCarrierSteps(numberOfSteps, dataOnSteps),
    numberOfSteps,
    requirements,
  };
};
