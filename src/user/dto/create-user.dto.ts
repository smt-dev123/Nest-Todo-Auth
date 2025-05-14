import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsEmpty,
  IsOptional,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsOptional()
  role?: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsEmpty()
  @IsOptional()
  task?: number;
}
