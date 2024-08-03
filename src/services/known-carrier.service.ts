import axios from 'axios';
import { getKnownCarrierStepsData } from './helpers/carrier/known/connect.helper';
import { generateCarrierSteps } from './helpers/carrier/known/carrier-config.helper';

export default class KnownCarrierService {
  private static stateStore: { [sessionID: string]: any } = {};

  private static async loadKnownCarrierData(carrierName: string) {
    const { dataOnSteps, numberOfSteps, requeriments } =
      await getKnownCarrierStepsData(carrierName);
    return {
      carrierConfig: generateCarrierSteps(numberOfSteps, dataOnSteps),
      numberOfSteps,
      requeriments,
    };
  }

  private static captureUserInput(
    sessionID: string,
    stepKey: string,
    data: any,
  ) {
    const state = this.getState(sessionID);
    if (!state.userInputs) {
      state.userInputs = [];
    }
    state.userInputs.push({ stepKey, data });
    this.updateState(sessionID, state.step, state);
    console.log(`User input for session ${sessionID}:`, state.userInputs);
  }

  public static async createKnownViaSteps(
    stepKey: string,
    data: any,
    sessionID: string,
  ): Promise<any> {
    try {
      const state = this.getState(sessionID);

      this.captureUserInput(sessionID, stepKey, data);

      if (stepKey === 'step1' && data.name) {
        state.name = data.name;
        const { carrierConfig, numberOfSteps, requeriments } =
          await this.loadKnownCarrierData(data.name);

        state.carrierSteps = carrierConfig;
        state.numberOfSteps = numberOfSteps;
        state.requeriments = requeriments;
        state.step = 'step1';
      } else if (stepKey !== 'step1' && !state.name) {
        throw new Error(
          'Previous steps not completed successfully (please provide the carrier name on step1, thanks)',
        );
      }

      const carrierSteps = state.carrierSteps;
      const step = carrierSteps[stepKey];

      if (!step) {
        throw new Error(
          `Step configuration for ${stepKey} is missing. Available steps: ${Object.keys(
            carrierSteps,
          ).join(', ')}`,
        );
      }

      await step.action(data, state);

      if (step.next === 'complete') {
        const axiosResponses = await this.performQueries(sessionID, true);
        await this.completeProcess(sessionID, state);
        return {
          message: `Process completed successfully! Carrier ${state.name} created.`,
          nextStep: '',
          stepsDetails: step.stepsDetails,
          form: step.form,
          axiosResponses,
        };
      } else {
        await this.updateState(sessionID, step.next, state);
        const axiosResponses = await this.performQueries(sessionID, true);
        return {
          message: await step.message(state),
          nextStep: step.next,
          stepsDetails: step.stepsDetails,
          form: step.form,
          axiosResponses,
        };
      }
    } catch (error) {
      console.error('Error in createKnownViaSteps:', error);
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

  public static async performQueries(sessionID: string, query: boolean) {
    const state = this.getState(sessionID);
    const { requeriments } = state;
    console.log('Requirements:', requeriments);
    if (!requeriments) {
      throw new Error('No requirements found in state.');
    }

    const results = [];

    if (query) {
      const userInputs = state.userInputs || [];
      let apiKey: string | undefined;
      let shipmentID: string | undefined;

      for (const input of userInputs) {
        if (input.data['DHL-API-Key']) {
          apiKey = input.data['DHL-API-Key'];
        }
        if (input.data['ShipmentID']) {
          shipmentID = input.data['ShipmentID'];
        }
      }

      if (apiKey && shipmentID) {
        const { url, method, requeriments: reqDetails } = requeriments;
        const finalUrl = url.replace('{ShipmentID}', shipmentID);

        const options: any = {
          method,
          url: finalUrl,
          headers: { ...reqDetails.header, 'DHL-API-Key': apiKey },
          params: reqDetails.paramas || {},
        };

        if (reqDetails.body && reqDetails.body !== 'null') {
          options.data = reqDetails.body;
        }

        try {
          const response = await axios(options);
          console.log(`Axios response:`, response.data);
          results.push({ response: response.data });
        } catch (error) {
          console.log(`Axios error:`, error);
          results.push({ error });
        }
      } else {
        console.log('Required API key or ShipmentID not found in user inputs.');
      }
    }

    return results;
  }
}
