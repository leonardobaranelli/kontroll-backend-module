// import admin from 'firebase-admin';
import { CarrierFirebase } from '../models/firebase/carrier.model';
import { getCarriersCollection } from '../config/database/firestore/firestore.config';
//import { Carrier } from '../models/carrier.model';
import {
  carrierConfig,
  StepKey,
} from './helpers/carrier/dhl-global-forwarding/dhl-g-f-config.helper';
import {
  ICarrierPublic,
  // AbstractCarrierPublic,
  IError,
} from '../utils/types/utilities.interface';
//import { getAttributes } from './helpers/commons/get-attributes.helper';
import { CreateStep2DTO, CreateStep3DTO, CreateStep4DTO } from '../utils/dtos';
import { validateOrReject } from 'class-validator';
import { plainToClass } from 'class-transformer';

export default class CarrierService {
  private static stateStore: { [sessionID: string]: any } = {};

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

  public static async handleStep(
    currentStep: StepKey,
    data: any,
    sessionID: string,
  ): Promise<any> {
    try {
      const state = await this.getState(sessionID);
      const stepConfig = carrierConfig[currentStep];

      if (!stepConfig) {
        throw new Error('Invalid step');
      }

      switch (currentStep) {
        case 'step2':
          await this.validateAndHandleStep(data, CreateStep2DTO, state);
          break;
        case 'step3':
          await this.validateAndHandleStep(data, CreateStep3DTO, state);
          break;
        case 'step4':
          await this.validateAndHandleStep(data, CreateStep4DTO, state);
          break;
        default:
          throw new Error('Invalid step');
      }

      await stepConfig.action(data, state);

      if (stepConfig.next === 'complete') {
        if (!(state.name && state.url && state.accountNumber && state.apiKey)) {
          throw new Error('Previous steps not completed successfully');
        }

        await this.completeProcess(sessionID, state);
        return {
          message: `Process completed successfully! Carrier ${state.name} created.`,
          nextStep: '',
          stepsDetails: {
            step: '5',
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
        await this.updateState(sessionID, stepConfig.next, state);
        return {
          message: stepConfig.message(state),
          nextStep: stepConfig.next,
          stepsDetails: stepConfig.stepsDetails,
          form: stepConfig.form,
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

  private static async validateAndHandleStep(
    data: any,
    DTOClass: any,
    state: any,
  ): Promise<void> {
    const stepData: any = plainToClass(DTOClass, data);
    await validateOrReject(stepData);
    Object.assign(state, stepData);
  }

  private static async completeProcess(
    sessionID: string,
    state: any,
  ): Promise<void> {
    try {
      const carriersCollection = getCarriersCollection()
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

  private static async updateState(
    sessionID: string,
    nextStep: StepKey,
    state: any,
  ): Promise<void> {
    try {
      this.stateStore[sessionID] = { ...state, currentStep: nextStep };
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
