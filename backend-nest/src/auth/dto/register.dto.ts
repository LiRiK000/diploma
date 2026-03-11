import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsEnum,
  IsDateString,
  IsMobilePhone,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '@prisma/client';
export class RegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'Фёдор' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Битаев' })
  @IsString()
  surname: string;

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

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  @ApiProperty({ enum: Gender, example: Gender.MALE, required: false })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;
}
