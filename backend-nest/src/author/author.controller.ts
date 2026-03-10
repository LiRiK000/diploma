import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AuthorsService } from './author.service';
import { CreateAuthorDto } from './dto/author.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { BulkFollowDto } from './dto/preference.dto';

@Controller('authors')
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) {}

  @Get()
  getAll(
    @Query('excludeIds') excludeIds?: string[],
    @Query('limit') limit?: number,
  ) {
    const formattedExclude = Array.isArray(excludeIds)
      ? excludeIds
      : excludeIds
        ? [excludeIds]
        : [];
    return this.authorsService.findAll(formattedExclude, Number(limit) || 10);
  }

  @Post('bulk-follow')
  @UseGuards(JwtAuthGuard)
  async bulkFollow(
    @CurrentUser('id') userId: string,
    @Body() dto: BulkFollowDto,
  ) {
    await this.authorsService.bulkFollow(userId, dto.authorIds);
    return { status: 'success', message: 'Предпочтения обновлены' };
  }
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getOne(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.authorsService.findOne(id, userId);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('LIBRARIAN')
  create(@Body() dto: CreateAuthorDto) {
    return this.authorsService.create(dto);
  }

  @Post(':id/toggle-follow')
  @UseGuards(JwtAuthGuard)
  toggleFollow(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.authorsService.toggleFollow(id, userId);
  }
}
