import { IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { IConnector } from '@/utils/types/models.interface';

export class UpdateConnectorDto implements Partial<IConnector> {
  @IsOptional()
  @IsString({ message: 'Type must be a string' })
  @Transform(({ value }) => value.trim())
  type?: string;
}
