import {
  IsNumber,
  IsString,
  IsDateString,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { IsISO } from './iso-validator';

export class OriginDto {
  @IsOptional()
  @IsString({ message: 'Location code must be a string' })
  @IsISO('location')
  @Transform(({ value }) => value.trim())
  LocationCode!: string;

  @IsOptional()
  @IsString({ message: 'Location name must be a string' })
  @Transform(({ value }) => value.trim())
  LocationName!: string;

  @IsOptional()
  @IsString({ message: 'Country code must be a string' })
  @IsISO('country')
  @Transform(({ value }) => value.trim())
  CountryCode!: string;
}

export class DestinationDto {
  @IsOptional()
  @IsString({ message: 'Location code must be a string' })
  @IsISO('location')
  @Transform(({ value }) => value.trim())
  LocationCode!: string;

  @IsOptional()
  @IsString({ message: 'Location name must be a string' })
  @Transform(({ value }) => value.trim())
  LocationName!: string;

  @IsOptional()
  @IsString({ message: 'Country code must be a string' })
  @IsISO('country')
  @Transform(({ value }) => value.trim())
  CountryCode!: string;
}

export class DateAndTimesDto {
  @IsOptional()
  @IsString({ message: 'Scheduled departure must be a string' })
  @Transform(({ value }) => value?.trim())
  ScheduledDeparture!: string | null;

  @IsOptional()
  @IsString({ message: 'Scheduled Arrival must be a string' })
  @Transform(({ value }) => value?.trim())
  ScheduledArrival!: string | null;

  @IsOptional()
  @IsString({ message: 'Shipment date must be a string' })
  @Transform(({ value }) => value?.trim())
  ShipmentDate!: string | null;
}

export class TotalWeightDto {
  @IsOptional()
  @IsNumber({}, { message: 'Weight value must be a number' })
  '*body'!: number | null;

  @IsOptional()
  @IsString({ message: 'Weight unit must be a string' })
  @Transform(({ value }) => value?.trim())
  '@uom'!: string | null;
}

export class TotalVolumeDto {
  @IsOptional()
  @IsNumber({}, { message: 'Volume value must be a number' })
  '*body'!: number | null;

  @IsOptional()
  @IsString({ message: 'Volume unit must be a string' })
  @Transform(({ value }) => value?.trim())
  '@uom'!: string | null;
}

export class TimestampDto {
  @IsOptional()
  @IsString({ message: 'Timestamp code must be a string' })
  @Transform(({ value }) => value.trim())
  TimestampCode!: string;

  @IsOptional()
  @IsString({ message: 'Timestamp description must be a string' })
  @Transform(({ value }) => value.trim())
  TimestampDescription!: string;

  @IsOptional()
  @IsString({ message: 'Timestamp date time must be a string' })
  @Transform(({ value }) => value.trim())
  TimestampDateTime!: string;

  @IsOptional()
  @IsString({ message: 'Timestamp location must be a string' })
  @Transform(({ value }) => value.trim())
  TimestampLocation!: string;
}

export class TimestampItemDto {
  @IsOptional()
  @IsString({ message: 'Timestamp code must be a string' })
  @Transform(({ value }) => value.trim())
  TimestampCode!: string;

  @IsOptional()
  @IsString({ message: 'Timestamp description must be a string' })
  @Transform(({ value }) => value.trim())
  TimestampDescription!: string;

  @IsOptional()
  @IsString({ message: 'Timestamp date time must be a string' })
  @Transform(({ value }) => value.trim())
  TimestampDateTime!: string;

  @IsOptional()
  @IsString({ message: 'Timestamp location must be a string' })
  @Transform(({ value }) => value.trim())
  TimestampLocation!: string;
}
