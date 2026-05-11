import { NotificationType, NotificationPriority } from '@prisma/client';
import {
  IsEnum,
  IsOptional,
  IsString,
  IsObject,
  IsUUID,
} from 'class-validator';

export class CreateNotificationDto {
  @IsUUID()
  userId: string | undefined;

  @IsString()
  title: string | undefined;

  @IsString()
  message: string | undefined;

  @IsEnum(NotificationType)
  @IsOptional()
  type?: NotificationType;

  @IsEnum(NotificationPriority)
  @IsOptional()
  priority?: NotificationPriority;

  @IsObject()
  @IsOptional()
  payload?: any;

  @IsString()
  @IsOptional()
  link?: string;
}
