import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchDto } from './dto/search.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('search')
  @ApiOperation({ summary: 'Поиск книг (основной)' })
  search(@Query() dto: SearchDto) {
    return this.searchService.searchBooks(dto);
  }

  @Get('suggestions')
  @ApiOperation({ summary: 'Предложения при вводе (авторы + книги)' })
  suggestions(@Query() dto: SearchDto) {
    return this.searchService.getSuggestions(dto);
  }
}
