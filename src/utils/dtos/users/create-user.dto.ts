import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsUrl,
  IsOptional,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { IUser } from '../../types/models.interface';

type MaybeString = string | undefined;

export class CreateUserDto implements Omit<IUser, 'id' | 'role'> {
  @IsNotEmpty({ message: 'Name cannot be empty' })
  @IsString({ message: 'Name must be a string' })
  @Transform(({ value }) => value.trim())
  readonly name: string = '';

  @IsNotEmpty({ message: 'Last name cannot be empty' })
  @IsString({ message: 'Last name must be a string' })
  @Transform(({ value }) => value.trim())
  readonly lastName: string = '';

  @IsNotEmpty({ message: 'Email cannot be empty' })
  @IsEmail({}, { message: 'Email must be valid' })
  @Transform(({ value }) => value.trim())
  readonly username: string = '';

  @IsNotEmpty({ message: 'Password cannot be empty' })
  @IsString({ message: 'Password must be a string' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Transform(({ value }) => value.trim())
  password: string = '';

  @IsOptional()
  @IsUrl({}, { message: 'Avatar URL must be a valid URL' })
  @Transform(({ value }) => value.trim())
  readonly avatarUrl?: MaybeString;
}
