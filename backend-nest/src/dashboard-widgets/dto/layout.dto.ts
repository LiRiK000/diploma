import { IsNumber, IsString, IsBoolean, IsOptional } from 'class-validator';

export class GridItemLayoutDto {
  @IsString()
  i: string;

  @IsNumber()
  x: number;

  @IsNumber()
  y: number;

  @IsNumber()
  w: number;

  @IsNumber()
  h: number;

  @IsOptional()
  @IsNumber()
  minW?: number;

  @IsOptional()
  @IsNumber()
  maxW?: number;

  @IsOptional()
  @IsNumber()
  minH?: number;

  @IsOptional()
  @IsNumber()
  maxH?: number;

  @IsOptional()
  @IsBoolean()
  static?: boolean;
}
