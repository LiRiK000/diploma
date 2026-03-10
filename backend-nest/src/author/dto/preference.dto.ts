import { IsArray, IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class GetAuthorsQueryDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  excludeIds?: string[];
}

export class BulkFollowDto {
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  authorIds: string[];
}
