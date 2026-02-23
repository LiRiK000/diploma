import { IsString, IsNotEmpty } from 'class-validator';

export class GenreDto {
  @IsString()
  @IsNotEmpty()
  label: string;

  @IsString()
  @IsNotEmpty()
  value: string;
}
