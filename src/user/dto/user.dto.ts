import { IsNotEmpty, IsString, IsEmail, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  name: string;
}
