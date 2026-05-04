import {
  IsString,
  IsBoolean,
  IsArray,
  IsOptional,
  IsInt,
} from 'class-validator';

export class CreateCollectionDto {
  @IsString()
  title: string | undefined;

  @IsString()
  slug: string | undefined;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsInt()
  @IsOptional()
  order?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  bookIds?: string[];
}
