import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({ example: 'uuid-книги' })
  @IsString()
  @IsNotEmpty()
  bookId: string;

  @ApiProperty({ example: 'Очень интересная книга, советую прочитать!' })
  @IsString()
  @IsNotEmpty()
  @MinLength(10, { message: 'Отзыв слишком короткий' })
  @MaxLength(1000, { message: 'Отзыв слишком длинный' })
  description: string;
}
