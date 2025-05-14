import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class LoginAuthDto {
  @IsString()
  @IsOptional()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
