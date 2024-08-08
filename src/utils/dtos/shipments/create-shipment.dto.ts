import 'reflect-metadata';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { IShipment } from '../../types/models.interface';
import { shipmentContentDto } from './shipment-content.dto';

export class CreateShipmentDto implements Omit<IShipment, 'id'> {
  @IsNotEmpty({ message: 'Carrier ID cannot be empty' })
  @IsString({ message: 'Carrier ID number must be a string' })
  @Transform(({ value }) => value.trim())
  carrierId: string = '';

  @IsNotEmpty({ message: 'Shipment content cannot be empty' })
  @ValidateNested()
  @Type(() => shipmentContentDto)
  shipmentContent!: shipmentContentDto;
}
