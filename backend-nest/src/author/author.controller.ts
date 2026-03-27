import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  Query,
  UseInterceptors,
  UploadedFile,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthorsService } from './author.service';
import { CreateAuthorDto, UpdateAuthorDto } from './dto/author.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { BulkFollowDto } from './dto/preference.dto';

@ApiTags('Authors')
@Controller('authors')
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) {}

  @Get()
  @ApiOperation({ summary: 'Получить всех авторов' })
  getAll(
    @Query('excludeIds') excludeIds?: string[],
    @Query('limit') limit?: number,
  ) {
    const formattedExclude = Array.isArray(excludeIds)
      ? excludeIds
      : excludeIds
        ? [excludeIds]
        : [];

    return this.authorsService.findAll(
      formattedExclude,
      limit ? Number(limit) : undefined,
    );
  }

  @Post('bulk-follow')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Массовая подписка' })
  async bulkFollow(
    @CurrentUser('id') userId: string,
    @Body() dto: BulkFollowDto,
  ) {
    await this.authorsService.bulkFollow(userId, dto.authorIds);
    return { status: 'success', message: 'Предпочтения обновлены' };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Получить одного автора' })
  getOne(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.authorsService.findOne(id, userId);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('LIBRARIAN')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Создать автора с фото' })
  create(
    @Body() dto: CreateAuthorDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.authorsService.create(dto, file);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('LIBRARIAN')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Обновить автора и фото' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateAuthorDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.authorsService.update(id, dto, file);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('LIBRARIAN')
  delete(@Param('id') id: string) {
    return this.authorsService.delete(id);
  }

  @Post(':id/toggle-follow')
  @UseGuards(JwtAuthGuard)
  toggleFollow(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.authorsService.toggleFollow(id, userId);
  }
}
