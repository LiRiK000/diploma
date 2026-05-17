import { IsDateString, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class StatsRangeQueryDto {
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() === '' ? undefined : value,
  )
  @IsDateString({}, { message: 'from must be a valid ISO 8601 date string' })
  from?: string;

  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() === '' ? undefined : value,
  )
  @IsDateString({}, { message: 'to must be a valid ISO 8601 date string' })
  to?: string;
}
