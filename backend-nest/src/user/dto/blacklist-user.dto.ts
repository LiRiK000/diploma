import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BlacklistUserDto {
  @ApiProperty({ example: 'Систематическая просрочка возврата книг' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  banReason: string;
}
