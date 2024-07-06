import {
  IsNotEmpty,
  IsOptional,
  IsString,
  //IsDateString,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { IShipment } from '../../types/models.interface';

type MaybeString = string | null;

export class CreateShipmentDto implements Omit<IShipment, 'id'> {
  @IsNotEmpty({ message: 'Name cannot be empty' })
  @IsString({ message: 'Name must be a string' })
  @Transform(({ value }) => value.trim())
  readonly name: string = '';

  @IsOptional()
  @IsString({ message: 'Tracking number must be a string' })
  @Transform(({ value }) => value.trim())
  readonly trackingNumber?: MaybeString;

  @IsOptional()
  @IsString({ message: 'Origin country must be a string' })
  @Transform(({ value }) => value.trim())
  readonly originCountry?: MaybeString;

  @IsOptional()
  @IsString({ message: 'Final country must be a string' })
  @Transform(({ value }) => value.trim())
  readonly finalCountry?: MaybeString;

  @IsOptional()
  //@IsDateString({}, { message: 'Departure date must be a valid date' })
  @Transform(({ value }) => value.trim())
  readonly departureDate?: MaybeString;

  @IsOptional()
  //@IsDateString({}, { message: 'Arrival date must be a valid date' })
  @Transform(({ value }) => value.trim())
  readonly arrivalDate?: MaybeString;

  @IsOptional()
  @IsString({ message: 'Status must be a string' })
  @Transform(({ value }) => value.trim())
  readonly status?: MaybeString;

  @IsOptional()
  @IsString({ message: 'Provider must be a string' })
  @Transform(({ value }) => value.trim())
  readonly provider?: MaybeString;

  @IsOptional()
  @IsString({ message: 'Courier must be a string' })
  @Transform(({ value }) => value.trim())
  readonly courier?: MaybeString;
}
