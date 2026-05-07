import { IsString, MinLength } from 'class-validator';

export class ConfirmPickupDto {
  @IsString()
  @MinLength(4)
  pickupCode: string | undefined;
}
