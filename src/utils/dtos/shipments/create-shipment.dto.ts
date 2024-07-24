import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
  IsArray,
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
} from './create-shipment-dto-classes';

export class CreateShipmentDto implements Partial<IShipment> {
  @IsNotEmpty({ message: 'Housebill number cannot be empty' })
  @IsString({ message: 'Housebill number must be a string' })
  @Transform(({ value }) => value.trim())
  HousebillNumber!: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => OriginDto)
  Origin?: OriginDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => DestinationDto)
  Destination?: DestinationDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => DateAndTimesDto)
  DateAndTimes?: DateAndTimesDto;

  @IsOptional()
  @IsString({ message: 'Product type must be a string' })
  @Transform(({ value }) => value?.trim() || null)
  ProductType?: string | null;

  @IsOptional()
  @IsNumber({}, { message: 'Total packages must be a number' })
  TotalPackages?: number | null;

  @IsOptional()
  @ValidateNested()
  @Type(() => TotalWeightDto)
  TotalWeight?: TotalWeightDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => TotalVolumeDto)
  TotalVolume?: TotalVolumeDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TimestampDto)
  Timestamp?: TimestampDto[];

  @IsOptional()
  @IsString({ message: 'Broker name must be a string' })
  @Transform(({ value }) => value?.trim())
  brokerName?: string | null;

  @IsOptional()
  @IsString({ message: 'Incoterms must be a string' })
  @Transform(({ value }) => value?.trim())
  incoterms?: string | null;

  @IsOptional()
  @IsString({ message: 'Shipment date must be a string' })
  @Transform(({ value }) => value?.trim())
  shipmentDate?: string | null;

  @IsOptional()
  @IsString({ message: 'Booking must be a string' })
  @Transform(({ value }) => value?.trim())
  booking?: string | null;

  @IsOptional()
  @IsString({ message: 'MAWB must be a string' })
  @Transform(({ value }) => value?.trim())
  mawb?: string | null;

  @IsOptional()
  @IsString({ message: 'HAWB must be a string' })
  @Transform(({ value }) => value?.trim())
  hawb?: string | null;

  @IsOptional()
  @IsString({ message: 'Flight must be a string' })
  @Transform(({ value }) => value?.trim())
  flight?: string | null;

  @IsOptional()
  @IsString({ message: 'Airport of departure must be a string' })
  @Transform(({ value }) => value?.trim())
  airportOfDeparture?: string | null;

  @IsOptional()
  @IsString({ message: 'ETD must be a string' })
  @Transform(({ value }) => value?.trim())
  etd?: string | null;

  @IsOptional()
  @IsString({ message: 'ATD must be a string' })
  @Transform(({ value }) => value?.trim())
  atd?: string | null;

  @IsOptional()
  @IsString({ message: 'Airport of arrival must be a string' })
  @Transform(({ value }) => value?.trim())
  airportOfArrival?: string | null;

  @IsOptional()
  @IsString({ message: 'ETA must be a string' })
  @Transform(({ value }) => value?.trim())
  eta?: string | null;

  @IsOptional()
  @IsString({ message: 'ATA must be a string' })
  @Transform(({ value }) => value?.trim())
  ata?: string | null;

  @IsOptional()
  @IsString({ message: 'Vessel must be a string' })
  @Transform(({ value }) => value?.trim())
  vessel?: string | null;

  @IsOptional()
  @IsString({ message: 'Port of loading must be a string' })
  @Transform(({ value }) => value?.trim())
  portOfLoading?: string | null;

  @IsOptional()
  @IsString({ message: 'MBL must be a string' })
  @Transform(({ value }) => value?.trim())
  mbl?: string | null;

  @IsOptional()
  @IsString({ message: 'HBL must be a string' })
  @Transform(({ value }) => value?.trim())
  hbl?: string | null;

  @IsOptional()
  @IsString({ message: 'Pickup date must be a string' })
  @Transform(({ value }) => value?.trim())
  pickupDate?: string | null;

  @IsOptional()
  @IsString({ message: 'Container number must be a string' })
  @Transform(({ value }) => value?.trim())
  containerNumber?: string | null;

  @IsOptional()
  @IsString({ message: 'Port of unloading must be a string' })
  @Transform(({ value }) => value?.trim())
  portOfUnloading?: string | null;

  @IsOptional()
  @IsString({ message: 'Final destination must be a string' })
  @Transform(({ value }) => value?.trim())
  finalDestination?: string | null;

  @IsOptional()
  @IsString({ message: 'International carrier must be a string' })
  @Transform(({ value }) => value?.trim())
  internationalCarrier?: string | null;

  @IsOptional()
  @IsString({ message: 'Voyage must be a string' })
  @Transform(({ value }) => value?.trim())
  voyage?: string | null;

  @IsOptional()
  @IsString({ message: 'Port of receipt must be a string' })
  @Transform(({ value }) => value?.trim())
  portOfReceipt?: string | null;

  @IsOptional()
  @IsString({ message: 'Goods description must be a string' })
  @Transform(({ value }) => value?.trim())
  goodsDescription?: string | null;

  @IsOptional()
  @IsArray()
  containers?: Array<any> | null;
}
