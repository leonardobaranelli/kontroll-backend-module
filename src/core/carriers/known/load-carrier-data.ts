import { getKnownCarrierStepsData } from './connect';
import { generateCarrierSteps } from './carrier-config';

export const loadKnownCarrierData = async (carrierName: string) => {
  const { dataOnSteps, numberOfSteps, requeriments } =
    await getKnownCarrierStepsData(carrierName);
  return {
    carrierConfig: generateCarrierSteps(numberOfSteps, dataOnSteps),
    numberOfSteps,
    requeriments,
  };
};
