import { ICarrier } from '../../utils/types/models.interface';

type MaybeString = string | null;

export class CarrierFirebase implements ICarrier {
  id!: string;
  name!: string;
  url!: string;
  accountNumber?: MaybeString;
  apiKey?: MaybeString;
  memoryParser?: {};
  connectors?: string;
  steps?: string;
}
