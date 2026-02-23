import { IsString, IsOptional, IsInt, IsArray } from 'class-validator';

export class CreateBookDto {
  @IsString()
  title: string;

  @IsString()
  authorId: string;

  @IsString()
  genreId: string;

  @IsOptional()
  @IsInt()
  availableQuantity?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  subjects?: string[];

  @IsOptional()
  @IsString()
  publisher?: string;

  @IsOptional()
  publishedDate?: string;

  @IsOptional()
  @IsInt()
  pageCount?: number;

  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @IsString()
  coverImage?: string;
}
