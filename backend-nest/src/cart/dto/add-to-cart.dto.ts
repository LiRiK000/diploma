import { IsString, IsInt, Min, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddToCartDto {
  @ApiProperty({ example: 'uuid-книги' })
  @IsString()
  bookId: string;

  @ApiProperty({ example: 1, default: 1 })
  @IsInt()
  @Min(1)
  @IsOptional()
  quantity?: number = 1;
}
