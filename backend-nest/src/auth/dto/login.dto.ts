import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Электронная почта пользователя',
  })
  @IsEmail({}, { message: 'Введите корректный email' })
  email: string;

  @ApiProperty({
    example: '123456',
    description: 'Пароль (минимум 6 символов)',
  })
  @IsString({ message: 'Пароль должен быть строкой' })
  @MinLength(6, { message: 'Пароль слишком короткий' })
  password: string;
}
