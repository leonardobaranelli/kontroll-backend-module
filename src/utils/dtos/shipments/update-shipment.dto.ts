import {
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
} from './update-shipment-dto-classes';

export class UpdateShipmentDto implements Partial<IShipment> {
  @IsOptional()
  @IsString({ message: 'Housebill number must be a string' })
  @Transform(({ value }) => value.trim())
  HousebillNumber?: string;

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
  @IsNumber({}, { message: 'Total packages must be a valid number' })
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
  @Transform(({ value }) => value?.trim() || null)
  brokerName?: string | null;

  @IsOptional()
  @IsString({ message: 'Incoterms must be a string' })
  @Transform(({ value }) => value?.trim() || null)
  incoterms?: string | null;

  @IsOptional()
  @IsString({ message: 'Shipment date must be a string' })
  @Transform(({ value }) => value?.trim() || null)
  shipmentDate?: string | null;

  @IsOptional()
  @IsString({ message: 'Booking must be a string' })
  @Transform(({ value }) => value?.trim() || null)
  booking?: string | null;

  @IsOptional()
  @IsString({ message: 'MAWB must be a string' })
  @Transform(({ value }) => value?.trim() || null)
  mawb?: string | null;

  @IsOptional()
  @IsString({ message: 'HAWB must be a string' })
  @Transform(({ value }) => value?.trim() || null)
  hawb?: string | null;

  @IsOptional()
  @IsString({ message: 'Flight must be a string' })
  @Transform(({ value }) => value?.trim() || null)
  flight?: string | null;

  @IsOptional()
  @IsString({ message: 'Airport of departure must be a string' })
  @Transform(({ value }) => value?.trim() || null)
  airportOfDeparture?: string | null;

  @IsOptional()
  @IsString({ message: 'ETD must be a string' })
  @Transform(({ value }) => value?.trim() || null)
  etd?: string | null;

  @IsOptional()
  @IsString({ message: 'ATD must be a string' })
  @Transform(({ value }) => value?.trim() || null)
  atd?: string | null;

  @IsOptional()
  @IsString({ message: 'Airport of arrival must be a string' })
  @Transform(({ value }) => value?.trim() || null)
  airportOfArrival?: string | null;

  @IsOptional()
  @IsString({ message: 'ETA must be a string' })
  @Transform(({ value }) => value?.trim() || null)
  eta?: string | null;

  @IsOptional()
  @IsString({ message: 'ATA must be a string' })
  @Transform(({ value }) => value?.trim() || null)
  ata?: string | null;

  @IsOptional()
  @IsString({ message: 'Vessel must be a string' })
  @Transform(({ value }) => value?.trim() || null)
  vessel?: string | null;

  @IsOptional()
  @IsString({ message: 'Port of loading must be a string' })
  @Transform(({ value }) => value?.trim() || null)
  portOfLoading?: string | null;

  @IsOptional()
  @IsString({ message: 'MBL must be a string' })
  @Transform(({ value }) => value?.trim() || null)
  mbl?: string | null;

  @IsOptional()
  @IsString({ message: 'HBL must be a string' })
  @Transform(({ value }) => value?.trim() || null)
  hbl?: string | null;

  @IsOptional()
  @IsString({ message: 'Pickup date must be a string' })
  @Transform(({ value }) => value?.trim() || null)
  pickupDate?: string | null;

  @IsOptional()
  @IsString({ message: 'Container number must be a string' })
  @Transform(({ value }) => value?.trim() || null)
  containerNumber?: string | null;

  @IsOptional()
  @IsString({ message: 'Port of unloading must be a string' })
  @Transform(({ value }) => value?.trim() || null)
  portOfUnloading?: string | null;

  @IsOptional()
  @IsString({ message: 'Final destination must be a string' })
  @Transform(({ value }) => value?.trim() || null)
  finalDestination?: string | null;

  @IsOptional()
  @IsString({ message: 'International carrier must be a string' })
  @Transform(({ value }) => value?.trim() || null)
  internationalCarrier?: string | null;

  @IsOptional()
  @IsString({ message: 'Voyage must be a string' })
  @Transform(({ value }) => value?.trim() || null)
  voyage?: string | null;

  @IsOptional()
  @IsString({ message: 'Port of receipt must be a string' })
  @Transform(({ value }) => value?.trim() || null)
  portOfReceipt?: string | null;

  @IsOptional()
  @IsString({ message: 'Goods description must be a string' })
  @Transform(({ value }) => value?.trim() || null)
  goodsDescription?: string | null;

  @IsOptional()
  @IsArray()
  containers?: Array<any> | null;
}
