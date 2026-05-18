// statistics.controller.ts
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { StatsRangeQueryDto } from './dto/stats-range-query.dto';
import { StatisticsService } from './statistics.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('admin/shift-kpi')
  @Roles(Role.LIBRARIAN)
  getAdminShiftKpi(@Query() query: StatsRangeQueryDto) {
    return this.statisticsService.getAdminShiftKpi(query);
  }

  @Get('admin/overview')
  @Roles(Role.LIBRARIAN)
  getAdminOverview(@Query() query: StatsRangeQueryDto) {
    return this.statisticsService.getAdminOverview(query);
  }

  @Get('admin/issuance-by-genre')
  @Roles(Role.LIBRARIAN)
  getAdminIssuanceByGenre(@Query() query: StatsRangeQueryDto) {
    return this.statisticsService.getAdminIssuanceByGenre(query);
  }

  @Get('admin/dynamics')
  @Roles(Role.LIBRARIAN)
  getAdminDynamics(@Query() query: StatsRangeQueryDto) {
    return this.statisticsService.getAdminLibraryDynamics(query);
  }

  @Get('admin/overdue-analytics')
  @Roles(Role.LIBRARIAN)
  getAdminOverdue(@Query() query: StatsRangeQueryDto) {
    return this.statisticsService.getAdminOverdueAnalytics(query);
  }

  @Get('admin/dynamic-widget')
  @Roles(Role.LIBRARIAN)
  getDynamicWidget(
    @Query('source') source: string,
    @Query() query: StatsRangeQueryDto,
  ) {
    return this.statisticsService.getDynamicWidgetData(source, query);
  }

  @Get('me/summary')
  getMeSummary(
    @CurrentUser('id') userId: string,
    @Query() query: StatsRangeQueryDto,
  ) {
    return this.statisticsService.getMeSummary(userId, query);
  }
}
