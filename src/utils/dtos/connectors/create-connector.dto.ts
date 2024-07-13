import { IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { IConnector } from '../../types/models.interface';

export class CreateConnectorDto implements Omit<IConnector, 'id'> {
  @IsNotEmpty({ message: 'Type cannot be empty' })
  @IsString({ message: 'Type must be a string' })
  @Transform(({ value }) => value.trim())
  readonly type: string = '';
}
