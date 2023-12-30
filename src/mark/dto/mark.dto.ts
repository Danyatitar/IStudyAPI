import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateMarkDto {
  @IsNumber()
  @IsNotEmpty()
  mark: number;
}
