import { plainToClass } from 'class-transformer';
import {
  validateSync,
  IsString,
  IsOptional,
  ValidateNested,
  IsArray,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

class Location {
  @IsOptional()
  @IsString()
  LocationCode?: string | null;

  @IsOptional()
  @IsString()
  LocationName?: string | null;

  @IsOptional()
  @IsString()
  CountryCode?: string | null;
}

class DateAndTimes {
  @IsOptional()
  @IsString()
  ScheduledDeparture?: string | null;

  @IsOptional()
  @IsString()
  ScheduledArrival?: string | null;

  @IsOptional()
  @IsString()
  ShipmentDate?: string | null;
}

class Weight {
  @IsOptional()
  @IsNumber()
  '*body': number | null;

  @IsOptional()
  @IsString()
  '@uom': string | null;
}

class Timestamp {
  @IsOptional()
  @IsString()
  TimestampCode?: string | null;

  @IsOptional()
  @IsString()
  TimestampDescription?: string | null;

  @IsOptional()
  @IsString()
  TimestampDateTime?: string | null;

  @IsOptional()
  @IsString()
  TimestampLocation?: string | null;
}

export class ParsedShipmentContent {
  @IsString()
  HousebillNumber!: string;

  @ValidateNested()
  @Type(() => Location)
  Origin: Location = new Location();

  @ValidateNested()
  @Type(() => Location)
  Destination: Location = new Location();

  @ValidateNested()
  @Type(() => DateAndTimes)
  DateAndTimes: DateAndTimes = new DateAndTimes();

  @IsOptional()
  @IsString()
  ProductType?: string | null;

  @IsOptional()
  @IsNumber()
  TotalPackages?: number | null;

  @ValidateNested()
  @Type(() => Weight)
  TotalWeight: Weight = new Weight();

  @ValidateNested()
  @Type(() => Weight)
  TotalVolume: Weight = new Weight();

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Timestamp)
  Timestamp: Timestamp[] = [];

  @IsOptional()
  @IsString()
  shipmentDate?: string | null;

  // Add other fields as needed
}

export function validateParsedShipmentContent(
  data: any,
): ParsedShipmentContent {
  const shipmentContent = plainToClass(ParsedShipmentContent, data);
  const errors = validateSync(shipmentContent);

  if (errors.length > 0) {
    throw new Error(`Validation failed: ${JSON.stringify(errors)}`);
  }

  return shipmentContent;
}
