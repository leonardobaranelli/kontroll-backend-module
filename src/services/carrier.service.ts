import { Carrier } from '../models/carrier.model';
import {
  getCarriersCollection,
  cleanData,
} from '../config/database/firestore/firestore.config';
import { loadCarrierData } from '../core/carriers/create-by-steps/new/dev-get-req-via-doc/load-carrier-data';
import { loadKnownCarrierData } from '../core/carriers/create-by-steps/known/load-carrier-data';
import { ICarrierPublic, IError } from '../utils/types/utilities.interface';

import areAllRequirementsCaptured from '../core/carriers/create-by-steps/known/are-all-requirements-captured';
import performQueries from '../core/carriers/create-by-steps/known/perform-queries';
import _performQueries from '../core/carriers/create-by-steps/new/manual/perform-queries';
import isGetShipmentEndpoint from '../core/carriers/create-by-steps/new/manual/is-get-shipment-endpoint';

import docNotFoundResponse from './helpers/carrier/dev/doc-not-found-response.helper';
import completeProcessResponse from './helpers/carrier/complete-process-response.helper';

export default class CarrierService {
  private static stateStore: { [sessionID: string]: any } = {};

  private static getState(sessionID: string): any {
    return this.stateStore[sessionID] || {};
  }

  private static async _updateState(
    sessionID: string,
    state: any,
  ): Promise<void> {
    try {
      this.stateStore[sessionID] = { ...state };
    } catch (error) {
      console.error('Error in updateState:', error);
      throw new Error(
        `Failed to update state for session ${sessionID}: ${error}`,
      );
    }
  }

  private static async _completeProcess(
    sessionID: string,
    state: any,
  ): Promise<void> {
    try {
      const carriersCollection = getCarriersCollection();
      const cleanedState = cleanData({
        userId: 'admin',
        name: state.name,
        shipmentId: state.shipmentId,
        endpoints: state.endpoints,
      });
      await carriersCollection.add(cleanedState);
      delete this.stateStore[sessionID];
    } catch (error) {
      console.error('Error in completeProcess:', error);
      throw new Error(`Failed to complete carrier creation process: ${error}`);
    }
  }

  private static _captureUserInput(
    name: string,
    shipmentId: string,
    endpoints: Array<object>,
    sessionID: string,
  ) {
    const state = this.getState(sessionID);
    if (!state.userInputs) {
      state.userInputs = [];
    }
    state.userInputs.push({ name, shipmentId, endpoints });
    console.log(
      `User input for session ${sessionID}:`.yellow,
      state.userInputs,
    );

    this._updateState(sessionID, state).catch((error) => {
      console.error('Error updating state:', error);
    });
  }

  public static async createNew(
    name: string,
    shipmentId: string,
    endpoints: Array<object>,
    sessionID: string,
  ): Promise<any> {
    try {
      this._captureUserInput(name, shipmentId, endpoints, sessionID);
      const state = await this.getState(sessionID);

      if (state.userInputs && state.userInputs.length > 0) {
        const lastUserInput = state.userInputs[state.userInputs.length - 1];

        if (lastUserInput.endpoints && lastUserInput.endpoints.length > 0) {
          const lastEndpoint =
            lastUserInput.endpoints[lastUserInput.endpoints.length - 1];
          const axiosResponse = await _performQueries(lastEndpoint, true);

          if (isGetShipmentEndpoint(shipmentId, lastEndpoint)) {
            await this._completeProcess(sessionID, state);
            return completeProcessResponse(state.name, axiosResponse);
          }
          return completeProcessResponse(state.name, axiosResponse);
        } else {
          throw new Error('No endpoints available in the last user input.');
        }
      } else {
        throw new Error('User inputs are not initialized or empty.');
      }
    } catch (error) {
      console.error('Error in createNew:'.bgMagenta, error);
      return {
        error: true,
        message: 'Failed to create new endpoint: ' + error,
      };
    }
  }

  //! #####################

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
      const cleanedState = cleanData({
        userId: 'admin',
        name: state.name,
        endpoints: state.endpoints,
        steps: state.steps,
      });
      await carriersCollection.add(cleanedState);
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
        const { carrierConfig, numberOfSteps, requirements } =
          await loadKnownCarrierData(data.name);

        state.carrierSteps = carrierConfig;
        state.numberOfSteps = numberOfSteps;
        state.requirements = requirements;
        state.step = 'step1';
      } else if (stepKey !== 'step1' && !state.name) {
        throw new Error(
          'Previous steps not completed correctly (please provide the carrier name on step1, thanks)',
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

      if (
        areAllRequirementsCaptured(state.requirements, state.userInputs) &&
        state.requirements &&
        state.userInputs
      ) {
        const axiosResponse = await performQueries(state, true);
        await this.completeProcess(sessionID, state);
        return completeProcessResponse(state.name, axiosResponse);
      }

      if (step.next === 'complete') {
        const axiosResponse = await performQueries(state, true);
        await this.completeProcess(sessionID, state);
        return completeProcessResponse(state.name, axiosResponse);
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
        const data = doc.data() as Carrier;
        return {
          id: doc.id,
          userId: data.userId,
          name: data.name,
          endpoints: data.endpoints,
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

  // Development on pause
  public static async devGetReqViaDoc(
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
            return docNotFoundResponse(state.name);
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
          'Previous steps not completed correctly (please provide the carrier name on step2, thanks)',
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
        return completeProcessResponse(state.name);
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
}
