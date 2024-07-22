import { carrierStepsData } from './get-steps.helper';

interface StepConfig {
  action: (data: any, state: any) => void | Promise<void>;
  message: (state: any) => string | Promise<string>;
  stepsDetails: {
    step: string;
    stepTitle: string;
    details1: string;
    details2: string;
    details3: string;
    details4: string;
  };
  form: {
    expectedFieldName: string;
    instruction: string;
    label: string;
    title: string;
    placeholder: string;
  };
  next: string;
}

export const generateCarrierConfig = (
  numberOfSteps: number,
  dataOnSteps: any,
): Record<string, StepConfig> | string => {
  if (!dataOnSteps || dataOnSteps.length === 0) {
    return 'No documentation found for the carrier.';
  }

  const config: Record<string, StepConfig> = {};

  for (let i = 0; i < numberOfSteps; i++) {
    const stepIndex = i + 2;
    const stepData = dataOnSteps[i];

    config[`step${stepIndex}`] = {
      action: async (data: any, state: any) => {
        if (stepIndex === 2) state.name = data.name;
      },
      message: async (state: any) => {
        if (stepIndex === 2) {
          const result = await carrierStepsData(state.name);
          if (result) {
            return `Requeriments via documentation to carrier ${state.name} founded!`;
          } else {
            return `No documentation found for carrier ${state.name}.`;
          }
        } else if (stepIndex === numberOfSteps + 1) {
          return `Connection with the ${state.name} carrier established correctly`;
        }
        return `Step ${stepIndex} completed!`;
      },
      stepsDetails: {
        step: stepData.stepsDetails.step,
        stepTitle: stepData.stepsDetails.stepTitle,
        details1: stepData.stepsDetails.details1,
        details2: stepData.stepsDetails.details2,
        details3: stepData.stepsDetails.details3,
        details4: stepData.stepsDetails.details4,
      },
      form: {
        expectedFieldName: stepData.form.expectedFieldName,
        instruction: stepData.form.instruction,
        label: stepData.form.label,
        title: stepData.form.title,
        placeholder: stepData.form.placeholder,
      },
      next:
        stepIndex === numberOfSteps + 1 ? 'complete' : `step${stepIndex + 1}`,
    };
  }

  return config;
};
