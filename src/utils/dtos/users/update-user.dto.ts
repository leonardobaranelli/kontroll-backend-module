import {
  IsEmail,
  IsString,
  IsUrl,
  IsOptional,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { IUser } from '../../types/models.interface';

type MaybeString = string | undefined;

export class UpdateUserDto implements Partial<IUser> {
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  @Transform(({ value }) => value.trim())
  name?: string;

  @IsOptional()
  @IsString({ message: 'Last name must be a string' })
  @Transform(({ value }) => value.trim())
  lastName?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email must be valid' })
  @Transform(({ value }) => value.trim())
  username?: string;

  @IsOptional()
  @IsString({ message: 'Password must be a string' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Transform(({ value }) => value.trim())
  password?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Avatar URL must be a valid URL' })
  @Transform(({ value }) => value.trim())
  avatarUrl?: MaybeString;
}
