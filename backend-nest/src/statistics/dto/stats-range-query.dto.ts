import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum DateRangePreset {
  TODAY = 'TODAY',
  WEEK = 'WEEK',
  MONTH = 'MONTH',
  YEAR = 'YEAR',
  CUSTOM = 'CUSTOM',
}

export class StatsRangeQueryDto {
  @IsOptional()
  @IsEnum(DateRangePreset)
  range?: DateRangePreset;

  @IsOptional()
  @IsString()
  from?: string;

  @IsOptional()
  @IsString()
  to?: string;
}
