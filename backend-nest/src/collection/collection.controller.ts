import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CollectionService } from './collection.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@ApiTags('Collections (Admin)')
@Controller('collections')
@UseGuards(JwtAuthGuard) // Защищаем эндпоинты
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  @Post()
  @ApiOperation({ summary: 'Создать новую подборку' })
  create(@Body() createCollectionDto: CreateCollectionDto) {
    return this.collectionService.create(createCollectionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить все подборки (для таблицы админки)' })
  findAll() {
    return this.collectionService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить детали подборки с книгами' })
  findOne(@Param('id') id: string) {
    return this.collectionService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Обновить подборку и её состав книг' })
  update(
    @Param('id') id: string,
    @Body() updateCollectionDto: UpdateCollectionDto,
  ) {
    return this.collectionService.update(id, updateCollectionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить подборку' })
  remove(@Param('id') id: string) {
    return this.collectionService.remove(id);
  }
}
