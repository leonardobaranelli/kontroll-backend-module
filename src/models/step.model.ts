import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  AllowNull,
  ForeignKey,
  BelongsTo,
  BelongsToMany,
} from 'sequelize-typescript';
import { Carrier } from './carrier.model';
import { CarrierStep } from './pivot-tables/carrier-step.model';
import { IStepDetails, IForm, IStep } from '@/utils/types/models.interface';

@Table({
  tableName: 'step',
  timestamps: false,
})
export class Step extends Model<IStep> implements IStep {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => Carrier)
  @AllowNull(false)
  @Column(DataType.UUID)
  carrierId!: string;

  @BelongsTo(() => Carrier)
  carrier!: Carrier;

  @AllowNull(false)
  @Column(DataType.JSON)
  stepsDetails!: IStepDetails;

  @AllowNull(false)
  @Column(DataType.JSON)
  form!: IForm;

  @BelongsToMany(() => Carrier, () => CarrierStep)
  carriers!: Carrier[];
}
