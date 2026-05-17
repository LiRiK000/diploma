import { BadRequestException, Injectable } from '@nestjs/common';
import { OrderStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { StatsRangeQueryDto } from './dto/stats-range-query.dto';

const DEFAULT_RANGE_DAYS = 30;

@Injectable()
export class StatisticsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Валидация и резолв дат с защитой от пустых строк с фронтенда
   */
  private resolveRange(dto: StatsRangeQueryDto) {
    const now = new Date();

    const rawTo = dto.to && dto.to.trim() !== '' ? dto.to : now;
    const to = new Date(rawTo);

    let from: Date;
    if (dto.from && dto.from.trim() !== '') {
      from = new Date(dto.from);
    } else {
      from = new Date(to);
      from.setUTCDate(from.getUTCDate() - DEFAULT_RANGE_DAYS);
    }

    if (isNaN(from.getTime()) || isNaN(to.getTime())) {
      throw new BadRequestException(
        'Некорректный формат дат. Ожидается ISO строка.',
      );
    }
    if (from > to) {
      throw new BadRequestException('Дата "от" не может быть больше даты "до"');
    }

    return { from, to };
  }

  /**
   * Виджет: Общая сводка и круговая диаграмма статусов
   */
  async getAdminOverview(dto: StatsRangeQueryDto) {
    const { from, to } = this.resolveRange(dto);

    const [newUsers, ordersInRange, orderItemsAgg, reviewsInRange, booksTotal] =
      await this.prisma.$transaction([
        this.prisma.user.count({
          where: { createdAt: { gte: from, lte: to } },
        }),
        this.prisma.order.count({
          where: { orderDate: { gte: from, lte: to } },
        }),
        this.prisma.orderItem.aggregate({
          where: { order: { orderDate: { gte: from, lte: to } } },
          _sum: { quantity: true },
        }),
        this.prisma.review.count({
          where: { createdAt: { gte: from, lte: to } },
        }),
        this.prisma.book.count(),
      ]);

    const ordersByStatus = await this.prisma.order.groupBy({
      by: ['status'],
      where: { orderDate: { gte: from, lte: to } },
      _count: { _all: true },
    });

    return {
      range: { from: from.toISOString(), to: to.toISOString() },
      newUsersInRange: newUsers,
      ordersInRange,
      orderItemsQuantitySum: orderItemsAgg._sum.quantity ?? 0,
      reviewsInRange,
      booksTotalCatalog: booksTotal,
      ordersByStatus: ordersByStatus.map((row) => ({
        status: row.status,
        count: row._count._all,
      })),
    };
  }

  /**
   * Виджет: Популярность жанров (RadarChart)
   */
  async getAdminIssuanceByGenre(dto: StatsRangeQueryDto) {
    const { from, to } = this.resolveRange(dto);

    const rows = await this.prisma.$queryRaw<any[]>(Prisma.sql`
      SELECT g.id, g.label, g.value,
             COALESCE(SUM(oi.quantity), 0)::int AS "totalQuantity",
             COUNT(DISTINCT o.id)::int AS "distinctOrders"
      FROM order_items oi
      INNER JOIN orders o ON o.id = oi."orderId"
      INNER JOIN books b ON b.id = oi."bookId"
      INNER JOIN genres g ON g.id = b."genreId"
      WHERE o."orderDate" >= ${from.toISOString()}::timestamp 
        AND o."orderDate" <= ${to.toISOString()}::timestamp
        AND o.status <> ${OrderStatus.CANCELLED}::"OrderStatus"
      GROUP BY g.id, g.label, g.value
      ORDER BY "totalQuantity" DESC
    `);

    return { genres: rows };
  }

  /**
   * Виджет: Динамика библиотеки (AreaChart)
   * Исправлено: выдачи и возвраты агрегируются раздельно по своим фактическим датам
   */
  async getAdminLibraryDynamics(dto: StatsRangeQueryDto) {
    const { from, to } = this.resolveRange(dto);
    const fromStr = from.toISOString();
    const toStr = to.toISOString();

    const dailyStats = await this.prisma.$queryRaw<any[]>(Prisma.sql`
      WITH RECURSIVE days AS (
        SELECT day::date FROM generate_series(${fromStr}::timestamp, ${toStr}::timestamp, '1 day'::interval) day
      ),
      issued_stats AS (
        SELECT "orderDate"::date as dt, COUNT(id)::int as cnt
        FROM orders
        WHERE "orderDate" >= ${fromStr}::timestamp AND "orderDate" <= ${toStr}::timestamp
        GROUP BY "orderDate"::date
      ),
      returned_stats AS (
        SELECT "returnDate"::date as dt, COUNT(id)::int as cnt
        FROM orders
        WHERE "returnDate" >= ${fromStr}::timestamp AND "returnDate" <= ${toStr}::timestamp
        GROUP BY "returnDate"::date
      )
      SELECT 
        days.day::text as "date",
        COALESCE(i.cnt, 0) as "issued",
        COALESCE(r.cnt, 0) as "returned"
      FROM days
      LEFT JOIN issued_stats i ON i.dt = days.day
      LEFT JOIN returned_stats r ON r.dt = days.day
      ORDER BY days.day ASC
    `);

    return { data: dailyStats };
  }

  /**
   * Виджет: Аналитика просрочек (BarChart)
   * Исправлено: невалидный DateTime заменен на валидный Prisma-синтаксис `not: null`
   */
  /**
   * Виджет: Аналитика просрочек (BarChart)
   */
  /**
   * KPI библиотекаря за текущую смену (сегодня)
   */
  async getAdminShiftKpi() {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const activeStatuses: OrderStatus[] = [
      OrderStatus.PENDING,
      OrderStatus.APPROVED,
      OrderStatus.READY_TO_PICKUP,
      OrderStatus.ON_HAND,
    ];

    const [activeOrders, issuedToday, returnsToday, overdue] =
      await this.prisma.$transaction([
        this.prisma.order.count({
          where: { status: { in: activeStatuses } },
        }),
        this.prisma.order.count({
          where: {
            orderDate: { gte: startOfToday },
            status: { not: OrderStatus.CANCELLED },
          },
        }),
        this.prisma.order.count({
          where: { returnDate: { gte: startOfToday } },
        }),
        this.prisma.order.count({
          where: { status: OrderStatus.OVERDUE },
        }),
      ]);

    return { activeOrders, issuedToday, returnsToday, overdue };
  }

  async getAdminOverdueAnalytics() {
    const now = new Date();
    const overdueOrders = await this.prisma.order.findMany({
      where: {
        status: OrderStatus.OVERDUE,
        returnDate: null,
        dueDate: {
          not: null, // <- ЗДЕСЬ ДОЛЖНО БЫТЬ СЛОВО null, А НЕ DateTime!
        },
      },
      select: {
        dueDate: true,
      },
    });

    const groups = { '1-3 дн': 0, '4-7 дн': 0, '8-14 дн': 0, '14+ дн': 0 };

    overdueOrders.forEach((o) => {
      const diff = Math.floor(
        (now.getTime() - o.dueDate.getTime()) / (1000 * 3600 * 24),
      );
      if (diff <= 3) groups['1-3 дн']++;
      else if (diff <= 7) groups['4-7 дн']++;
      else if (diff <= 14) groups['8-14 дн']++;
      else groups['14+ дн']++;
    });

    return Object.entries(groups).map(([label, value]) => ({ label, value }));
  }

  /**
   * Личная статистика пользователя
   */
  async getMeSummary(userId: string, dto: StatsRangeQueryDto) {
    const { from, to } = this.resolveRange(dto);

    const distinctBooksCountAgg = await this.prisma.orderItem.groupBy({
      by: ['bookId'],
      where: { order: { userId, orderDate: { gte: from, lte: to } } },
    });

    const [ordersCount, itemsAgg, reviewsCount, user] =
      await this.prisma.$transaction([
        this.prisma.order.count({
          where: { userId, orderDate: { gte: from, lte: to } },
        }),
        this.prisma.orderItem.aggregate({
          where: { order: { userId, orderDate: { gte: from, lte: to } } },
          _sum: { quantity: true },
        }),
        this.prisma.review.count({
          where: { userId, createdAt: { gte: from, lte: to } },
        }),
        this.prisma.user.findUnique({
          where: { id: userId },
          select: { _count: { select: { favoriteGenres: true } } },
        }),
      ]);

    return {
      ordersCount,
      booksBorrowedDistinct: distinctBooksCountAgg.length,
      totalItemsQuantity: itemsAgg._sum.quantity ?? 0,
      reviewsWritten: reviewsCount,
      favoriteGenresCount: user?._count.favoriteGenres ?? 0,
    };
  }
  async getDynamicWidgetData(source: string, range: 'week' | 'month' | 'year') {
    const to = new Date();
    const from = new Date();

    // Вычисляем диапазон на бэкенде исходя из конфига виджета
    if (range === 'week') from.setDate(from.getDate() - 7);
    else if (range === 'month') from.setDate(from.getDate() - 30);
    else if (range === 'year') from.setDate(from.getDate() - 365);
    else throw new BadRequestException('Неподдерживаемый диапазон дат');

    const dto: StatsRangeQueryDto = {
      from: from.toISOString(),
      to: to.toISOString(),
    };

    switch (source) {
      case 'popular_genres': {
        // Переиспользуем твой готовый метод
        const result = await this.getAdminIssuanceByGenre(dto);
        return result.genres.map((g) => ({
          name: g.label,
          value: g.totalQuantity,
        }));
      }

      case 'workload': {
        const result = await this.getAdminLibraryDynamics(dto);
        return result.data.map((d) => ({
          name: d.date,
          value: d.issued,
          issued: d.issued,
          returned: d.returned,
        }));
      }

      case 'orders_status': {
        const result = await this.getAdminOverview(dto);
        return result.ordersByStatus.map((row) => ({
          name: row.status,
          value: row.count,
        }));
      }

      case 'overview_activity': {
        const result = await this.getAdminOverview(dto);
        return [
          { name: 'Читатели', value: result.newUsersInRange },
          { name: 'Заказы', value: result.ordersInRange },
          { name: 'Выдачи', value: result.orderItemsQuantitySum },
          { name: 'Отзывы', value: result.reviewsInRange },
        ];
      }

      case 'overdue': {
        // Переиспользуем аналитику просрочек
        const result = await this.getAdminOverdueAnalytics();
        return result.map((r) => ({
          name: r.label,
          value: r.value,
        }));
      }

      case 'popular_authors': {
        // Пишем быстрый топ авторов по выдачам
        const authors = await this.prisma.$queryRaw<any[]>(Prisma.sql`
          SELECT a."firstName", a."lastName", COALESCE(SUM(oi.quantity), 0)::int AS "total"
          FROM order_items oi
          INNER JOIN orders o ON o.id = oi."orderId"
          INNER JOIN books b ON b.id = oi."bookId"
          INNER JOIN authors a ON a.id = b."authorId"
          WHERE o."orderDate" >= ${from.toISOString()}::timestamp 
            AND o."orderDate" <= ${to.toISOString()}::timestamp
            AND o.status <> ${OrderStatus.CANCELLED}::"OrderStatus"
          GROUP BY a.id, a."firstName", a."lastName"
          ORDER BY "total" DESC
          LIMIT 5
        `);
        return authors.map((a) => ({
          name: `${a.firstName} ${a.lastName}`,
          value: a.total,
        }));
      }

      default:
        throw new BadRequestException('Неизвестный источник данных виджета');
    }
  }
}
