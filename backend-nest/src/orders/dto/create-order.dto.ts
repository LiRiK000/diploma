import { IsString, Length } from 'class-validator';

export class ConfirmPickupDto {
  @IsString()
  @Length(8, 8, { message: 'Код должен состоять из 8 символов' })
  pickupCode: string;
}
