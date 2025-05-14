import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTaskDto {
  @IsNumber()
  @IsOptional()
  userId: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  status: string;

  @IsDateString()
  @IsOptional()
  dueDate: string;

  @IsString()
  @IsOptional()
  image?: string;
}
