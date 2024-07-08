import { IsOptional, IsString, IsUrl } from 'class-validator';
import { Transform } from 'class-transformer';
import { IConnector } from '@/utils/types/models.interface';

type MaybeString = string | null;

export class UpdateConnectorDto implements Partial<IConnector> {
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  @Transform(({ value }) => value.trim())
  name?: string;

  @IsOptional()
  @IsUrl({}, { message: 'API URL must be a valid URL' })
  @Transform(({ value }) => value.trim())
  apiUrl?: MaybeString;

  @IsOptional()
  @IsString({ message: 'API Key must be a string' })
  @Transform(({ value }) => value.trim())
  apiKey?: MaybeString;
}
