import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';
import { Transform } from 'class-transformer';
import { IConnector } from '../../types/models.interface';

type MaybeString = string | null;

export class CreateConnectorDto implements Omit<IConnector, 'id'> {
  @IsNotEmpty({ message: 'Name cannot be empty' })
  @IsString({ message: 'Name must be a string' })
  @Transform(({ value }) => value.trim())
  readonly name: string = '';

  @IsOptional()
  @IsUrl({}, { message: 'API URL must be a valid URL' })
  @Transform(({ value }) => value.trim())
  readonly apiUrl?: MaybeString;

  @IsOptional()
  @IsString({ message: 'API Key must be a string' })
  @Transform(({ value }) => value.trim())
  readonly apiKey?: MaybeString;
}
