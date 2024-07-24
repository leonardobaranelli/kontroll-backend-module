import { IShipment } from './models.interface';

export interface ShipmentInput {
  [key: string]: any;
}

export interface ParserResult {
  success: boolean;
  data?: IShipment;
  error?: string;
}

export interface ParserOptions {
  useOpenAI: boolean;
}
