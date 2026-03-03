import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateReviewDto {
  @ApiProperty({
    example: 'Потрясающая книга, перечитал второй раз!',
    description: 'Текст рецензии',
  })
  @IsString()
  @MinLength(10, { message: 'Рецензия должна быть не менее 10 символов' })
  description: string;
}
