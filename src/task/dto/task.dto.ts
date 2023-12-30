import {
  IsNotEmpty,
  IsString,
  IsEmail,
  MinLength,
  IsNumber,
  min,
  IsBoolean,
  IsOptional,
  Min,
  IsDate,
} from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  name: string;

  @IsString()
  @IsNotEmpty()
  maxMark: string;

  @IsString()
  @IsNotEmpty()
  allowPublication: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsNotEmpty()
  deadline: string;

  @IsString()
  @IsNotEmpty()
  courseId: string;
}

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  @MinLength(4)
  name: string;

  @IsString()
  @IsOptional()
  maxMark: string;

  @IsString()
  @IsOptional()
  allowPublication: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  deadline: string;

  @IsString()
  @IsOptional()
  fileId: string;
}
