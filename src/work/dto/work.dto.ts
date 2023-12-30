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

export class CreateWorkDto {
  @IsString()
  @IsNotEmpty()
  publicate: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsNotEmpty()
  taskId: string;
}

export class UpdateWorkDto {
  @IsString()
  @IsOptional()
  publicate: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  taskId: string;
}

export class MarkWorkDto {
  @IsNumber()
  @IsNotEmpty()
  mark: number;
}
