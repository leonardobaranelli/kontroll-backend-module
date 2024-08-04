import axios from 'axios';
import { CarrierFirebase } from '../models/firebase/carrier.model';
import { getCarriersCollection } from '../config/database/firestore/firestore.config';
import { loadCarrierData } from '../core/carriers/new/dev/load-carrier-data';
import { loadKnownCarrierData } from '../core/carriers/known/load-carrier-data';
import { ICarrierPublic, IError } from '../utils/types/utilities.interface';

export default class CarrierService {
  private static stateStore: { [sessionID: string]: any } = {};

  private static getState(sessionID: string): any {
    return this.stateStore[sessionID] || {};
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

  private static async completeProcess(
    sessionID: string,
    state: any,
  ): Promise<void> {
    try {
      const carriersCollection = getCarriersCollection();
      await carriersCollection.add({
        name: state.name,
        url: state.url,
        accountNumber: state.accountNumber,
        apiKey: state.apiKey,
      });
      delete this.stateStore[sessionID];
    } catch (error) {
      console.error('Error in completeProcess:', error);
      throw new Error(`Failed to complete carrier creation process: ${error}`);
    }
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
          const { carrierConfig, numberOfSteps } = await loadCarrierData(
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
        throw new Error(
          `Step configuration for ${stepKey} is missing. Available steps: ${Object.keys(
            carrierSteps,
          ).join(', ')}`,
        );
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

  public static async createKnown(
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
          await loadKnownCarrierData(data.name);

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

      const allRequerimentsCaptured = this.areAllRequirementsCaptured(
        state.requeriments,
        state.userInputs,
      );

      if (step.next === 'complete' && allRequerimentsCaptured) {
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
        return {
          message: await step.message(state),
          nextStep: step.next,
          stepsDetails: step.stepsDetails,
          form: step.form,
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

  public static async createNew(
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
          await loadKnownCarrierData(data.name);

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

      const allRequerimentsCaptured = this.areAllRequirementsCaptured(
        state.requeriments,
        state.userInputs,
      );

      if (step.next === 'complete' && allRequerimentsCaptured) {
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
        return {
          message: await step.message(state),
          nextStep: step.next,
          stepsDetails: step.stepsDetails,
          form: step.form,
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

  private static areAllRequirementsCaptured(
    requirements: any,
    userInputs: any[],
  ): boolean {
    const requiredKeys = new Set<string>();

    if (requirements?.paramas && typeof requirements.paramas === 'object') {
      Object.keys(requirements.paramas).forEach((key) => requiredKeys.add(key));
    }

    if (requirements?.header && typeof requirements.header === 'object') {
      Object.keys(requirements.header).forEach((key) => requiredKeys.add(key));
    }

    if (
      requirements?.body &&
      typeof requirements.body === 'object' &&
      Object.keys(requirements.body).length > 0
    ) {
      this.extractKeysFromBody(requirements.body, requiredKeys);
    }

    const capturedKeys = new Set<string>();
    if (userInputs) {
      userInputs.forEach((input) => {
        Object.keys(input.data).forEach((key) => capturedKeys.add(key));
      });
    }

    for (const key of requiredKeys) {
      if (!capturedKeys.has(key)) {
        return false;
      }
    }

    return true;
  }

  private static extractKeysFromBody(body: any, keySet: Set<string>): void {
    if (typeof body === 'object' && body !== null) {
      for (const key in body) {
        if (body.hasOwnProperty(key)) {
          if (typeof body[key] === 'object') {
            this.extractKeysFromBody(body[key], keySet);
          } else {
            keySet.add(key);
          }
        }
      }
    }
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
      const replacements: { [key: string]: string | undefined } = {};

      for (const input of userInputs) {
        for (const key in input.data) {
          replacements[key] = input.data[key];
        }
      }

      const { url, method, requeriments: reqDetails } = requeriments;
      let finalUrl = url;

      for (const key in replacements) {
        if (replacements.hasOwnProperty(key)) {
          finalUrl = finalUrl.replace(`{${key}}`, replacements[key] as string);
        }
      }

      const options: any = {
        method,
        url: finalUrl,
        headers: reqDetails?.header ? { ...reqDetails.header } : {},
        params: reqDetails?.paramas ? { ...reqDetails.paramas } : {},
      };

      for (const key in options.headers) {
        if (options.headers[key] === 'value' && replacements[key]) {
          options.headers[key] = replacements[key];
        }
      }

      for (const param in options.params) {
        if (options.params[param] === 'value' && replacements[param]) {
          options.params[param] = replacements[param];
        }
      }

      if (reqDetails?.body) {
        if (
          typeof reqDetails.body === 'string' &&
          reqDetails.body.trim().startsWith('<?xml')
        ) {
          options.data = reqDetails.body;
          for (const key in replacements) {
            if (replacements.hasOwnProperty(key)) {
              options.data = options.data.replace(
                new RegExp(`{${key}}`, 'g'),
                replacements[key] as string,
              );
            }
          }
          options.headers['Content-Type'] = 'text/xml';
        } else if (typeof reqDetails.body === 'object') {
          options.data = reqDetails.body;
          for (const key in replacements) {
            if (replacements.hasOwnProperty(key)) {
              options.data = JSON.parse(
                JSON.stringify(options.data).replace(
                  new RegExp(`{${key}}`, 'g'),
                  replacements[key] as string,
                ),
              );
            }
          }
        }
      }

      try {
        const response = await axios(options);
        console.log(`Axios response:`, response.data);
        results.push({ response: response.data });
      } catch (error) {
        console.log(`Axios error:`, error);
        results.push({ error });
      }
    }

    return results;
  }

  public static async getAllCarriers(): Promise<ICarrierPublic[]> {
    try {
      const carriersCollection = getCarriersCollection();
      const snapshot = await carriersCollection.get();

      if (snapshot.empty) {
        const error: IError = new Error('There are no carriers available');
        error.statusCode = 404;
        throw error;
      }

      const allConnectors: ICarrierPublic[] = snapshot.docs.map((doc) => {
        const data = doc.data() as CarrierFirebase;
        return {
          id: doc.id,
          name: data.name,
          url: data.url,
          accountNUmber: data.accountNumber || [],
          apiKey: data.apiKey,
          connectors: data.connectors,
          steps: data.steps,
        } as ICarrierPublic;
      });

      return allConnectors;
    } catch (error) {
      throw error;
    }
  }

  public static async deleteAllCarriers(): Promise<void> {
    try {
      const carriersCollection = getCarriersCollection();
      const snapshot = await carriersCollection.get();

      if (snapshot.empty) {
        console.log('No carriers to delete');
        return;
      }

      const batch = carriersCollection.firestore.batch();
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      console.log('All carriers deleted succesfully');
    } catch (error) {
      throw error;
    }
  }

  public static async deleteCarrierById(id: string): Promise<void> {
    try {
      const carriersCollection = getCarriersCollection();
      const snapshot = await carriersCollection.where('id', '==', id).get();

      if (snapshot.empty) {
        console.log(`No carrier with ID ${id} found`);
        return;
      }

      const batch = carriersCollection.firestore.batch();
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      console.log(`Carrier with ID ${id} deleted succesfully`);
    } catch (error) {
      throw error;
    }
  }
}
