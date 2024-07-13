import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { Carrier } from '../carrier.model';
import { Step } from '../step.model';

@Table({
  tableName: 'CarrierSteps',
  timestamps: false,
})
export class CarrierStep extends Model<CarrierStep> {
  @ForeignKey(() => Carrier)
  @Column(DataType.UUID)
  carrierId!: string;

  @ForeignKey(() => Step)
  @Column(DataType.UUID)
  stepId!: string;
}
