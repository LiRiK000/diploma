// stats-range-query.dto.ts
import { IsOptional, IsString, IsEnum } from 'class-validator';

export enum DateRangePreset {
  TODAY = 'today',
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year',
  CUSTOM = 'custom',
}

export class StatsRangeQueryDto {
  @IsOptional()
  @IsString()
  from?: string;

  @IsOptional()
  @IsString()
  to?: string;

  @IsOptional()
  @IsEnum(DateRangePreset)
  range?: DateRangePreset;
}
