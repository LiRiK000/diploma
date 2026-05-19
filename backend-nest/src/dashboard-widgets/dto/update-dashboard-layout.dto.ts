import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { GridItemLayoutDto } from './layout.dto';

export class LayoutItemDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => GridItemLayoutDto)
  layout: GridItemLayoutDto;
}

export class UpdateDashboardLayoutDto {
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => LayoutItemDto)
  items: LayoutItemDto[];
}
