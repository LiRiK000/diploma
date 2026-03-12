import {
  IsDateString,
  IsEnum,
  IsMobilePhone,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '@prisma/client';

export class UpdateMeDto {
  @ApiProperty({ example: 'Фёдор', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'Битаев', required: false })
  @IsOptional()
  @IsString()
  surname?: string;

  @ApiProperty({ example: 'FedorDev', required: false })
  @IsOptional()
  @IsString()
  displayName?: string;

  @ApiProperty({ example: '79991234567', required: false })
  @IsOptional()
  @IsMobilePhone('ru-RU')
  phone?: string;

  @ApiProperty({ example: '2005-05-04', required: false })
  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @ApiProperty({ enum: Gender, example: Gender.MALE, required: false })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiProperty({ example: 'https://example.com/avatar.png', required: false })
  @IsOptional()
  @IsString()
  avatarUrl?: string;
}
