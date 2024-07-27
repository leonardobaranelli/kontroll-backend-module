import { IsNumber, IsString, IsDateString, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { IsISO } from './iso-validator';

type MaybeString = string | null;
type MaybeNumber = number | null;
type MaybeDate = Date | string | null;

export class OriginDto {
  @IsOptional()
  @IsString({ message: 'Location code must be a string' })
  @IsISO('location')
  @Transform(({ value }) => value?.trim() || null)
  LocationCode?: MaybeString;

  @IsOptional()
  @IsString({ message: 'Location name must be a string' })
  @Transform(({ value }) => value?.trim() || null)
  LocationName?: MaybeString;

  @IsOptional()
  @IsString({ message: 'Country code must be a string' })
  @IsISO('country')
  @Transform(({ value }) => value?.trim() || null)
  CountryCode?: MaybeString;
}

export class DestinationDto {
  @IsOptional()
  @IsString({ message: 'Location code must be a string' })
  @IsISO('location')
  @Transform(({ value }) => value?.trim() || null)
  LocationCode?: MaybeString;

  @IsOptional()
  @IsString({ message: 'Location name must be a string' })
  @Transform(({ value }) => value?.trim() || null)
  LocationName?: MaybeString;

  @IsOptional()
  @IsString({ message: 'Country code must be a string' })
  @IsISO('country')
  @Transform(({ value }) => value?.trim() || null)
  CountryCode?: MaybeString;
}

export class DateAndTimesDto {
  @IsOptional()
  @IsDateString({}, { message: 'Scheduled departure must be a valid date string' })
  @Transform(({ value }) => value?.trim() || null)
  ScheduledDeparture?: MaybeDate;

  @IsOptional()
  @IsDateString({}, { message: 'Scheduled Arrival must be a valid date string' })
  @Transform(({ value }) => value?.trim() || null)
  ScheduledArrival?: MaybeDate;

  @IsOptional()
  @IsDateString({}, { message: 'Shipment date must be a valid date string' })
  @Transform(({ value }) => value?.trim() || null)
  ShipmentDate?: MaybeDate;
}


export class TotalWeightDto {
  @IsOptional()
  @IsNumber({}, { message: 'Weight value must be a number' })
  @Transform(({ value }) => value === '' ? null : Number(value))
  '*body': MaybeNumber;

  @IsOptional()
  @IsString({ message: 'Weight unit must be a string' })
  @Transform(({ value }) => value?.trim() || null)
  '@uom': MaybeString;
}

export class TotalVolumeDto {
  @IsOptional()
  @IsNumber({}, { message: 'Volume value must be a number' })
  @Transform(({ value }) => value === '' ? null : Number(value))
  '*body': MaybeNumber;

  @IsOptional()
  @IsString({ message: 'Volume unit must be a string' })
  @Transform(({ value }) => value?.trim() || null)
  '@uom': MaybeString;
}

export class TimestampDto {
  @IsOptional()
  @IsString({ message: 'Timestamp code must be a string' })
  @Transform(({ value }) => value?.trim() || null)
  TimestampCode?: MaybeString;

  @IsOptional()
  @IsString({ message: 'Timestamp description must be a string' })
  @Transform(({ value }) => value?.trim() || null)
  TimestampDescription?: MaybeString;

  @IsOptional()
  @IsDateString({}, { message: 'Timestamp date time must be a valid date string' })
  @Transform(({ value }) => value?.trim() || null)
  TimestampDateTime?: MaybeDate;

  @IsOptional()
  @IsString({ message: 'Timestamp location must be a string' })
  @Transform(({ value }) => value?.trim() || null)
  TimestampLocation?: MaybeString;
}