import { Connector } from '../models/connector.model';
import { CreateConnectorDto } from '../utils/dtos';
import { IConnectorPublic } from '../utils/types/utilities.interface';
import { carrierConfig } from './helpers/carrier/dhl-global-forwarding/carrier-config.helper';

export default class CarrierService {
  public static async createConnector(
    connectorData: CreateConnectorDto,
  ): Promise<IConnectorPublic> {
    try {
      const newConnector: IConnectorPublic =
        await Connector.create(connectorData);
      return newConnector;
    } catch (error) {
      throw error;
    }
  }

  public static async handleStep(
    service: string,
    currentStep: string,
    data: any,
    sessionID: string,
  ): Promise<any> {
    const serviceSteps = carrierConfig[service]?.steps;

    if (!serviceSteps) {
      throw new Error('Invalid service');
    }

    const step = serviceSteps[currentStep];

    if (!step) {
      throw new Error('Invalid step');
    }

    const state = await this.getState(sessionID);
    await step.action(data, state);

    if (step.next === 'complete') {
      await this.completeProcess(sessionID);
      return { message: 'Process completed successfully' };
    } else {
      await this.updateState(sessionID, step.next, state);
      return { message: 'Step completed successfully', nextStep: step.next };
    }
  }

  private static stateStore: { [sessionID: string]: any } = {};

  private static async getState(sessionID: string): Promise<any> {
    return this.stateStore[sessionID] || {};
  }

  private static async updateState(
    sessionID: string,
    nextStep: string,
    state: any,
  ): Promise<void> {
    this.stateStore[sessionID] = { ...state, currentStep: nextStep };
  }

  private static async completeProcess(sessionID: string): Promise<void> {
    delete this.stateStore[sessionID];
  }
}
