import { IsNotEmpty, IsString, IsUrl } from 'class-validator';
import { ICarrier } from '@/utils/types/models.interface';

export class CreateStep2DTO
  implements Omit<ICarrier, 'id' | 'accountNumber' | 'apiKey'>
{
  @IsNotEmpty({ message: 'Name cannot be empty' })
  @IsString({ message: 'Name must be a string' })
  readonly name: string = '';

  @IsNotEmpty({ message: 'URL cannot be empty' })
  @IsUrl({}, { message: 'URL must be a valid URL' })
  readonly url: string = '';
}

export class CreateStep3DTO
  implements Omit<ICarrier, 'id' | 'name' | 'url' | 'apiKey'>
{
  @IsNotEmpty({ message: 'Account number cannot be empty' })
  @IsString({ message: 'Account number must be a string' })
  readonly accountNumber: string = '';
}

export class CreateStep4DTO
  implements Omit<ICarrier, 'id' | 'name' | 'url' | 'accountNumber'>
{
  @IsNotEmpty({ message: 'API key cannot be empty' })
  @IsString({ message: 'API key must be a string' })
  readonly apiKey: string = '';
}
