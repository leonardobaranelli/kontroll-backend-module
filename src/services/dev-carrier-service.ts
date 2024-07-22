import { carrierStepsData } from './helpers/carrier/get-steps.helper';
import { generateCarrierConfig } from './helpers/carrier/carrier-config.helper';

export default class DevCarrierService {
  private static stateStore: { [sessionID: string]: any } = {};

  private static async loadCarrierData(carrierName: string) {
    const { dataOnSteps, numberOfSteps } = await carrierStepsData(carrierName);
    return {
      carrierConfig: generateCarrierConfig(numberOfSteps, dataOnSteps),
      numberOfSteps,
    };
  }

  public static async devHandleStep(
    stepKey: string,
    data: any,
    sessionID: string,
  ): Promise<any> {
    try {
      const state = this.getState(sessionID);

      if (stepKey === 'step2') {
        if (data.name) {
          state.name = data.name;
          const { carrierConfig, numberOfSteps } = await this.loadCarrierData(
            data.name,
          );
          if (typeof carrierConfig === 'string') {
            return {
              message: `No documentation found for carrier ${state.name}.`,
              nextStep: '',
              stepsDetails: {
                step: 'step2',
                stepTitle: `No documentation found for carrier ${state.name}!`,
                details1: `No documentation found for carrier ${state.name}.`,
                details2: '',
                details3: '',
                details4: '',
              },
              form: {
                expectedFieldName: '',
                instruction: `No documentation found for carrier ${state.name}.`,
                label: '',
                title:
                  'Your connection has not been set up, because the documentation not found!',
                placeholder: '',
              },
            };
          }
          state.carrierSteps = carrierConfig;
          state.numberOfSteps = numberOfSteps;
          state.step = 'step2';
        } else {
          return {
            message: 'Please provide the carrier name.',
          };
        }
      }

      if (!state.name) {
        throw new Error(
          'Previous steps not completed successfully (please provide the carrier name on step2, thanks)',
        );
      }

      const carrierSteps = state.carrierSteps;
      const step = carrierSteps[stepKey];

      if (!step) {
        throw new Error(`Step configuration for ${stepKey} is missing.`);
      }

      await step.action(data, state);

      if (step.next === 'complete') {
        await this.completeProcess(sessionID, state);
        return {
          message: `Process completed successfully! Carrier ${state.name} created.`,
          nextStep: '',
          stepsDetails: {
            step: 'complete',
            stepTitle: 'We got it!',
            details1:
              "You are now ready to start making requests and integrating with your application. If you encounter any issues, don't hesitate to refer back to the tutorial or reach out to support.",
            details2: '',
            details3: '',
            details4: '',
          },
          form: {
            expectedFieldName: '',
            instruction:
              'You have the option to go to the dashboard to review existing information or create a new connector to add data.',
            label: '',
            title: 'Your connection has been successfully set up!',
            placeholder: '',
          },
        };
      } else {
        await this.updateState(sessionID, step.next, state);
        return {
          message: await step.message(state),
          nextStep: step.next,
          stepsDetails: step.stepsDetails,
          form: step.form,
        };
      }
    } catch (error) {
      console.error('Error in handleStep:', error);
      return {
        error: true,
        message: 'Failed to handle step: ' + error,
      };
    }
  }

  private static async completeProcess(
    sessionID: string,
    _state: any,
  ): Promise<void> {
    try {
      delete this.stateStore[sessionID];
    } catch (error) {
      console.error('Error in completeProcess:', error);
      throw new Error(`Failed to complete carrier creation process: ${error}`);
    }
  }

  private static async updateState(
    sessionID: string,
    nextStep: string,
    state: any,
  ): Promise<void> {
    try {
      this.stateStore[sessionID] = { ...state, step: nextStep };
    } catch (error) {
      console.error('Error in updateState:', error);
      throw new Error(
        `Failed to update state for session ${sessionID}: ${error}`,
      );
    }
  }

  private static getState(sessionID: string): any {
    return this.stateStore[sessionID] || {};
  }
}
