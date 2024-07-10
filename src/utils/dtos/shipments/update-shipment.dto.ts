import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { IShipment } from '../../types/models.interface';
import {
  OriginDto,
  DestinationDto,
  DateAndTimesDto,
  TotalWeightDto,
  TotalVolumeDto,
  TimestampDto,
} from './update-shipment-dto-classes';
type MaybeString = string | null;
type MaybeNumber = number | null;

export class UpdateShipmentDto implements Omit<IShipment, 'id'> {
  @IsOptional()
  @IsString({ message: 'Housebill number must be a string' })
  @Transform(({ value }) => value.trim())
  HousebillNumber: string = '';

  @ValidateNested()
  @Type(() => OriginDto)
  Origin!: OriginDto;

  @ValidateNested()
  @Type(() => DestinationDto)
  Destination!: DestinationDto;

  @ValidateNested()
  @Type(() => DateAndTimesDto)
  DateAndTimes!: DateAndTimesDto;

  @IsOptional()
  @IsString({ message: 'Product type date must be a string' })
  @Transform(({ value }) => value.trim())
  readonly ProductType?: MaybeString;

  @IsOptional()
  @IsNumber({}, { message: 'Total packages must be a valid number' })
  readonly TotalPackages?: MaybeNumber;

  @ValidateNested()
  @Type(() => TotalWeightDto)
  TotalWeight!: TotalWeightDto;

  @ValidateNested()
  @Type(() => TotalVolumeDto)
  TotalVolume!: TotalVolumeDto;

  @ValidateNested()
  @Type(() => TimestampDto)
  Timestamp!: TimestampDto;
}
