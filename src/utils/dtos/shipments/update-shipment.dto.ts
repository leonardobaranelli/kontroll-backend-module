import 'reflect-metadata';
import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { IShipment } from '../../types/models.interface';
import { shipmentContentDto } from './update-shipment-dto-classes';

export class UpdateShipmentDto implements Omit<IShipment, 'id'> {
  @IsOptional()
  @IsString({ message: 'Carrier ID number must be a string' })
  @Transform(({ value }) => value.trim())
  carrierId: string = '';

  @IsOptional()
  @ValidateNested()
  @Type(() => shipmentContentDto)
  shipmentContent!: shipmentContentDto;
}
