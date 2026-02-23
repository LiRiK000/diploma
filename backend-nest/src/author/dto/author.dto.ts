import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
} from 'class-validator';

export class CreateAuthorDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsDateString()
  dateOfBirth: string;

  @IsOptional()
  @IsDateString()
  dateOfDeath?: string;
}

export class UpdateAuthorDto {
  @IsOptional() @IsString() firstName?: string;
  @IsOptional() @IsString() lastName?: string;
  @IsOptional() @IsDateString() dateOfBirth?: string;
  @IsOptional() @IsDateString() dateOfDeath?: string;
}
