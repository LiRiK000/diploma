import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { StatisticsService } from '../statistics/statistics.service';
import { StatsRangeQueryDto } from '../statistics/dto/stats-range-query.dto';

import { CreateDashboardWidgetDto } from './dto/create-dashboard-widget.dto';
import { UpdateDashboardLayoutDto } from './dto/update-dashboard-layout.dto';
import { ReorderDashboardWidgetsDto } from './dto/update-dashboard-widget.dto';

@Injectable()
export class DashboardWidgetsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly statisticsService: StatisticsService,
  ) {}

  async getDashboardConfig(key: string) {
    const dashboard = await this.prisma.dashboard.findUnique({
      where: { key },
      include: {
        widgets: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!dashboard) {
      throw new NotFoundException('Dashboard not found');
    }

    return dashboard;
  }

  async findAll(dashboardId: string) {
    return this.prisma.dashboardWidget.findMany({
      where: { dashboardId },
      orderBy: { order: 'asc' },
    });
  }

  async findOne(id: string) {
    const widget = await this.prisma.dashboardWidget.findUnique({
      where: { id },
    });

    if (!widget) {
      throw new NotFoundException('Widget not found');
    }

    return widget;
  }

  async create(dto: CreateDashboardWidgetDto) {
    return this.prisma.dashboardWidget.create({
      data: {
        dashboardId: dto.dashboardId,
        key: dto.key,
        title: dto.title,
        type: dto.type,
        isEnabled: dto.isEnabled ?? true,
        order: dto.order ?? 0,
        layout: dto.layout as unknown as Prisma.InputJsonValue,
        settings: dto.settings as unknown as Prisma.InputJsonValue,
      },
    });
  }

  async update(id: string, dto: CreateDashboardWidgetDto) {
    await this.findOne(id);

    return this.prisma.dashboardWidget.update({
      where: { id },
      data: {
        key: dto.key,
        type: dto.type,
        title: dto.title,
        isEnabled: dto.isEnabled,
        order: dto.order,
        layout: dto.layout as unknown as Prisma.InputJsonValue,
        settings: dto.settings as Prisma.InputJsonValue,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.dashboardWidget.delete({
      where: { id },
    });
  }

  async reorder(dto: ReorderDashboardWidgetsDto) {
    await this.prisma.$transaction(
      dto.items.map((item) =>
        this.prisma.dashboardWidget.update({
          where: { id: item.id },
          data: { order: item.order },
        }),
      ),
    );

    return { success: true };
  }

  async updateLayout(dto: UpdateDashboardLayoutDto) {
    await this.prisma.$transaction(
      dto.items.map((item) =>
        this.prisma.dashboardWidget.update({
          where: { id: item.id },
          data: { layout: item.layout as unknown as Prisma.InputJsonValue },
        }),
      ),
    );

    return { success: true };
  }

  async toggle(id: string) {
    const widget = await this.findOne(id);

    return this.prisma.dashboardWidget.update({
      where: { id },
      data: { isEnabled: !widget.isEnabled },
    });
  }

  async getWidgetData(id: string, dto: StatsRangeQueryDto) {
    const widget = await this.prisma.dashboardWidget.findUnique({
      where: { id },
    });

    if (!widget) {
      throw new NotFoundException('Виджет не найден');
    }

    if (!widget.isEnabled) {
      throw new BadRequestException('Виджет отключен');
    }

    const settings = widget.settings as Record<string, any> | null;

    const source = settings?.dataSource || widget.key;

    return this.statisticsService.getDynamicWidgetData(source, dto);
  }
}
