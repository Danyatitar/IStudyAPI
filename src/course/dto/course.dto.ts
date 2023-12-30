import {
  IsNotEmpty,
  IsString,
  IsEmail,
  MinLength,
  IsArray,
} from 'class-validator';
import mongoose from 'mongoose';

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  name: string;
}

export class JoinCourseDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  code: string;
}

export class DeleteStudentsDto {
  @IsArray()
  @IsNotEmpty()
  students: string[];
}
