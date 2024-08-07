import { ICarrier } from '../utils/types/models.interface';
import { IEndpoint } from '../utils/types/models.interface';
import { IStep } from '../utils/types/models.interface';

export class Carrier implements ICarrier {
  id!: string;
  userId!: string;
  name!: string;
  endpoints!: IEndpoint[];
  steps?: IStep[];
}
