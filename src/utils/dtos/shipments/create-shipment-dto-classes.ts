import { IsNotEmpty, IsNumber, IsString, IsDateString } from 'class-validator';
import { Transform } from 'class-transformer';

export class OriginDto {
  @IsNotEmpty({ message: 'Location code cannot be empty' })
  @IsString({ message: 'Location code must be a string' })
  @Transform(({ value }) => value.trim())
  //Ensure location code is ISO 3166
  LocationCode!: string;

  @IsNotEmpty({ message: 'Location name cannot be empty' })
  @IsString({ message: 'Location name must be a string' })
  @Transform(({ value }) => value.trim())
  LocationName!: string;

  @IsNotEmpty({ message: 'Country code cannot be empty' })
  @IsString({ message: 'Country code must be a string' })
  @Transform(({ value }) => value.trim())
  CountryCode!: string;
}

export class DestinationDto {
  @IsNotEmpty({ message: 'Location code cannot be empty' })
  @IsString({ message: 'Location code must be a string' })
  @Transform(({ value }) => value.trim())
  //Ensure location code is ISO 3166
  LocationCode!: string;

  @IsNotEmpty({ message: 'Location name cannot be empty' })
  @IsString({ message: 'Location name must be a string' })
  @Transform(({ value }) => value.trim())
  LocationName!: string;

  @IsNotEmpty({ message: 'Country code cannot be empty' })
  @IsString({ message: 'Country code must be a string' })
  @Transform(({ value }) => value.trim())
  CountryCode!: string;
}

export class DateAndTimesDto {
  @IsNotEmpty({ message: 'Scheduled departure cannot be empty' })
  @IsString({ message: 'Scheduled departure must be a string' })
  @Transform(({ value }) => value.trim())
  ScheduledDeparture!: string;

  @IsNotEmpty({ message: 'Scheduled Arrival cannot be empty' })
  @IsString({ message: 'Scheduled Arrival must be a string' })
  @Transform(({ value }) => value.trim())
  ScheduledArrival!: string;

  @IsNotEmpty({ message: 'Shipment data cannot be empty' })
  @IsString({ message: 'Shipment data must be a string' })
  @Transform(({ value }) => value.trim())
  ShipmentDate!: string;
}

export class TotalWeightDto {
  @IsNotEmpty({ message: 'Weight value cannot be empty' })
  @IsNumber({}, { message: 'Weight value must be a number' })
  body!: number;

  @IsNotEmpty({ message: 'Weight unit cannot be empty' })
  @IsString({ message: 'Weight unit must be a string' })
  @Transform(({ value }) => value.trim())
  uom!: string;
}

export class TotalVolumeDto {
  @IsNotEmpty({ message: 'Volume value cannot be empty' })
  @IsNumber({}, { message: 'Volume value must be a number' })
  body!: number;

  @IsNotEmpty({ message: 'Volume unit cannot be empty' })
  @IsString({ message: 'Volume unit must be a string' })
  @Transform(({ value }) => value.trim())
  uom!: string;
}

export class TimestampDto {
  @IsNotEmpty({ message: 'Timestamp code cannot be empty' })
  @IsString({ message: 'Timestamp code must be a string' })
  @Transform(({ value }) => value.trim())
  TimestampCode!: string;

  @IsNotEmpty({ message: 'Timestamp description cannot be empty' })
  @IsString({ message: 'Timestamp description must be a string' })
  @Transform(({ value }) => value.trim())
  TimestampDescription!: string;

  @IsNotEmpty({ message: 'Timestamp date time cannot be empty' })
  @IsDateString(
    {},
    { message: 'Timestamp date time must be a valid date format' },
  )
  @Transform(({ value }) => (value instanceof Date ? value : new Date(value)))
  TimestampDateTime!: Date;

  @IsNotEmpty({ message: 'Timestamp location cannot be empty' })
  @IsString({ message: 'Timestamp location must be a string' })
  @Transform(({ value }) => value.trim())
  TimestampLocation!: string;
}
