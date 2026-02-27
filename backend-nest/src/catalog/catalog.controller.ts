import { Controller, Get, Query } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { GetCatalogDto } from './dto/get-catalog.dto';

@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get()
  getCatalog(@Query() dto: GetCatalogDto) {
    return this.catalogService.getCatalog(dto);
  }
}
