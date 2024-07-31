import { IConnector } from '@/utils/types/models.interface';

export class ConnectorFirebase implements IConnector {
  id!: string;
  type!: string;
  users?: string[];
}
