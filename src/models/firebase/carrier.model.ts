import { ICarrier } from '../../utils/types/models.interface';

export class CarrierFirebase implements ICarrier {
  id!: string;
  name!: string;
  url!: string;
  memoryParser?: {};
  connectors?: string;
  steps?: string;
}
