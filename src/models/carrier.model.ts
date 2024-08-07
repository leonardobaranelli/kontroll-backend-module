import { ICarrier } from '../utils/types/models.interface';

export class Carrier implements ICarrier {
  id!: string;
  name!: string;
  url!: string;
  memoryParser?: {};
  connectors?: string;
  steps?: string;
}
