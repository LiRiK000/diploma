import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiCookieAuth } from '@nestjs/swagger';
import { Role } from '@prisma/client';

import { UserBlockService } from './user-block.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { BlacklistUserDto } from './dto/blacklist-user.dto';
import { SuspendUserDto } from './dto/suspend-user.dto';

@ApiTags('Users')
@ApiCookieAuth()
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.LIBRARIAN)
export class UsersAdminController {
  constructor(private readonly userBlockService: UserBlockService) {}

  @Get()
  @ApiOperation({ summary: 'Список пользователей (библиотекарь)' })
  findAll() {
    return this.userBlockService.findAllForLibrarian();
  }

  @Post(':id/blacklist')
  @ApiOperation({ summary: 'Добавить пользователя в чёрный список' })
  blacklist(@Param('id') id: string, @Body() dto: BlacklistUserDto) {
    return this.userBlockService.addToBlacklist(id, dto.banReason);
  }

  @Post(':id/suspend')
  @ApiOperation({ summary: 'Временно заморозить пользователя' })
  suspend(@Param('id') id: string, @Body() dto: SuspendUserDto) {
    return this.userBlockService.suspendUser(
      id,
      new Date(dto.suspendedUntil),
      dto.banReason,
    );
  }

  @Post(':id/unblock')
  @ApiOperation({ summary: 'Разблокировать пользователя' })
  unblock(@Param('id') id: string) {
    return this.userBlockService.unblockUser(id);
  }
}
