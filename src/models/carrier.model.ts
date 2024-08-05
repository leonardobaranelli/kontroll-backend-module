import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  AllowNull,
  BelongsToMany,
} from 'sequelize-typescript';
import { Connector } from './connector.model';
import { ConnectorCarrier } from './pivot-tables/connector-carrier.model';
import { ICarrier } from '../utils/types/models.interface';
import { Step } from './step.model';
import { CarrierStep } from './pivot-tables/carrier-step.model';

@Table({
  tableName: 'carrier',
  timestamps: false,
})
export class Carrier extends Model<ICarrier> implements ICarrier {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  name!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  url!: string;

  @AllowNull(true)
  @Column(DataType.JSON)
  memoryParser?: {};

  @BelongsToMany(() => Connector, () => ConnectorCarrier)
  connectors!: Connector[];

  @BelongsToMany(() => Step, () => CarrierStep)
  steps!: Step[];
}
