import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';

import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { StatsRangeQueryDto } from '../statistics/dto/stats-range-query.dto';

import { DashboardWidgetsService } from './dashboard-widgets.service';
import { CreateDashboardWidgetDto } from './dto/create-dashboard-widget.dto';
import { UpdateDashboardLayoutDto } from './dto/update-dashboard-layout.dto';
import { ReorderDashboardWidgetsDto } from './dto/update-dashboard-widget.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('dashboard-widgets')
export class DashboardWidgetsController {
  constructor(
    private readonly dashboardWidgetsService: DashboardWidgetsService,
  ) {}

  @Get('dashboard/:key')
  getDashboardConfig(@Param('key') key: string) {
    return this.dashboardWidgetsService.getDashboardConfig(key);
  }

  @Get(':dashboardId')
  findAll(@Param('dashboardId') dashboardId: string) {
    return this.dashboardWidgetsService.findAll(dashboardId);
  }

  @Get('widget/:id')
  findOne(@Param('id') id: string) {
    return this.dashboardWidgetsService.findOne(id);
  }

  @Post()
  @Roles(Role.LIBRARIAN)
  create(@Body() dto: CreateDashboardWidgetDto) {
    return this.dashboardWidgetsService.create(dto);
  }

  @Patch(':id')
  @Roles(Role.LIBRARIAN)
  update(@Param('id') id: string, @Body() dto: CreateDashboardWidgetDto) {
    return this.dashboardWidgetsService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.LIBRARIAN)
  remove(@Param('id') id: string) {
    return this.dashboardWidgetsService.remove(id);
  }

  @Patch('reorder/all')
  @Roles(Role.LIBRARIAN)
  reorder(@Body() dto: ReorderDashboardWidgetsDto) {
    return this.dashboardWidgetsService.reorder(dto);
  }

  @Patch('layout/all')
  @Roles(Role.LIBRARIAN)
  updateLayout(@Body() dto: UpdateDashboardLayoutDto) {
    return this.dashboardWidgetsService.updateLayout(dto);
  }

  @Patch(':id/toggle')
  @Roles(Role.LIBRARIAN)
  toggle(@Param('id') id: string) {
    return this.dashboardWidgetsService.toggle(id);
  }

  @Get(':id/data')
  @Roles(Role.LIBRARIAN)
  getWidgetData(@Param('id') id: string, @Query() query: StatsRangeQueryDto) {
    return this.dashboardWidgetsService.getWidgetData(id, query);
  }
}
