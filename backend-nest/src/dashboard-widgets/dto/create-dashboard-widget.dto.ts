import {
  IsString,
  IsBoolean,
  IsInt,
  IsOptional,
  IsNotEmpty,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { GridItemLayoutDto } from './layout.dto';

export class CreateDashboardWidgetDto {
  @IsString()
  @IsNotEmpty()
  dashboardId: string;

  @IsString()
  @IsNotEmpty()
  key: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsBoolean()
  isEnabled?: boolean;

  @IsOptional()
  @IsInt()
  order?: number;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => GridItemLayoutDto)
  layout: GridItemLayoutDto;

  @IsOptional()
  @IsObject()
  settings?: Record<string, any>;
}
