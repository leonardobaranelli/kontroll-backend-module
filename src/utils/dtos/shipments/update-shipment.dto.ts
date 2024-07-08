import {
  IsOptional,
  IsString,
  //IsDateString,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { IShipment } from '@/utils/types/models.interface';

type MaybeString = string | null;

export class UpdateShipmentDto implements Partial<IShipment> {
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  @Transform(({ value }) => value.trim())
  name?: string;

  @IsOptional()
  @IsString({ message: 'Tracking number must be a string' })
  @Transform(({ value }) => value.trim())
  trackingNumber?: MaybeString;

  @IsOptional()
  @IsString({ message: 'Origin country must be a string' })
  @Transform(({ value }) => value.trim())
  originCountry?: MaybeString;

  @IsOptional()
  @IsString({ message: 'Final country must be a string' })
  @Transform(({ value }) => value.trim())
  finalCountry?: MaybeString;

  @IsOptional()
  //@IsDateString({}, { message: 'Departure date must be a valid date' })
  @Transform(({ value }) => value.trim())
  departureDate?: MaybeString;

  @IsOptional()
  //@IsDateString({}, { message: 'Arrival date must be a valid date' })
  @Transform(({ value }) => value.trim())
  arrivalDate?: MaybeString;

  @IsOptional()
  @IsString({ message: 'Status must be a string' })
  @Transform(({ value }) => value.trim())
  status?: MaybeString;

  @IsOptional()
  @IsString({ message: 'Provider must be a string' })
  @Transform(({ value }) => value.trim())
  provider?: MaybeString;

  @IsOptional()
  @IsString({ message: 'Courier must be a string' })
  @Transform(({ value }) => value.trim())
  courier?: MaybeString;
}
