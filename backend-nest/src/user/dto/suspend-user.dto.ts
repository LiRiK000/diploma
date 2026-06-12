import { IsDateString, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SuspendUserDto {
  @ApiProperty({ example: '2026-07-01T00:00:00.000Z' })
  @IsDateString()
  suspendedUntil: string;

  @ApiProperty({ example: 'Нарушение правил библиотеки' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  banReason: string;
}
