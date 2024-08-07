import { StepConfig } from '../../../../utils/types/models.interface';

export const generateCarrierSteps = (
  numberOfSteps: number,
  dataOnSteps: any,
): Record<string, StepConfig> | string => {
  if (!dataOnSteps || dataOnSteps.length === 0) {
    return 'No documentation found for the carrier.';
  }

  const config: Record<string, StepConfig> = {};

  for (let i = 0; i < numberOfSteps; i++) {
    const stepIndex = i + 1;
    const stepData = dataOnSteps[i];

    let stepsDetails;
    let form;
    let nextStep;

    if (stepIndex === numberOfSteps) {
      stepsDetails = finalStepsDetails;
      form = finalForm;
      nextStep = 'complete';
    } else {
      stepsDetails = {
        step: stepData.stepsDetails.step,
        stepTitle: stepData.stepsDetails.stepTitle,
        details1: stepData.stepsDetails.details1,
        details2: stepData.stepsDetails.details2,
        details3: stepData.stepsDetails.details3,
        details4: stepData.stepsDetails.details4,
      };
      form = {
        expectedFieldName: stepData.form.expectedFieldName,
        instruction: stepData.form.instruction,
        label: stepData.form.label,
        title: stepData.form.title,
        placeholder: stepData.form.placeholder,
      };
      nextStep = `step${stepIndex + 1}`;
    }

    config[`step${stepIndex}`] = {
      action: async (data: any, state: any) => {
        if (stepIndex === 1) state.name = data.name;
      },
      message: async (state: any) => {
        if (stepIndex === 1) {
          return `Requirements via documentation to carrier ${state.name} found!`;
        } else if (stepIndex === numberOfSteps) {
          return `Connection with the ${state.name} carrier established correctly`;
        }
        return `Step ${stepIndex} completed!`;
      },
      stepsDetails,
      form,
      next: nextStep,
    };
  }

  return config;
};

// Auxiliaries
const finalStepsDetails = {
  step: 'complete',
  stepTitle: 'We got it!',
  details1:
    "You are now ready to start making requests and integrating with your application. If you encounter any issues, don't hesitate to refer back to the tutorial or reach out to support.",
  details2: '',
  details3: '',
  details4: '',
};

const finalForm = {
  expectedFieldName: '',
  instruction:
    'You have the option to go to the dashboard to review existing information or create a new connector to add data.',
  label: '',
  title: 'Your connection has been successfully set up!',
  placeholder: '',
};
