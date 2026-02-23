import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SearchDto } from './dto/search.dto';

interface SuggestionItem {
  id: string;
  title: string;
  author: string | null;
  type: 'book' | 'author';
  sim: number;
}
@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async searchBooks(dto: SearchDto) {
    const { q: query, take } = dto;
    const searchTerms = `%${query}%`;

    // 1. Пытаемся найти точные совпадения
    const exactMatches = await this.prisma.$queryRaw<any[]>`
      SELECT b.id, b.title, b.description, b."coverImage", b."availableQuantity", b."authorId",
             (a."firstName" || ' ' || a."lastName") AS author,
             g.label AS genre,
             similarity(b.title, ${query}::text) AS sim
      FROM "books" b
      JOIN "authors" a ON b."authorId" = a.id
      JOIN "genres" g ON b."genreId" = g.id
      WHERE similarity(b.title, ${query}::text) > 0.4
      ORDER BY sim DESC LIMIT ${take}::int;
    `;

    if (exactMatches.length > 0) {
      return { status: 'success', matchType: 'exact', data: exactMatches };
    }

    // 2. Рекомендации (ILIKE)
    const recommendations = await this.prisma.$queryRaw<any[]>`
      SELECT b.id, b.title, b.description, b."coverImage", b."availableQuantity", b."authorId",
             (a."firstName" || ' ' || a."lastName") AS author,
             g.label AS genre,
             0.1 AS sim
      FROM "books" b
      JOIN "authors" a ON b."authorId" = a.id
      JOIN "genres" g ON b."genreId" = g.id
      WHERE b.title ILIKE ${searchTerms}::text OR b.description ILIKE ${searchTerms}::text
      ORDER BY b."availableQuantity" DESC LIMIT ${take}::int;
    `;

    return {
      status: 'success',
      matchType: 'recommendations',
      data: recommendations,
    };
  }

  async getSuggestions(dto: SearchDto) {
    const { q: query, take } = dto;
    if (!query.trim()) return { status: 'success', data: [] };

    const searchTerms = `%${query}%`;

    const suggestions = await this.prisma.$queryRaw<SuggestionItem[]>`
      SELECT id, ("firstName" || ' ' || "lastName") AS title, NULL AS author, 'author' AS type,
             similarity(("firstName" || ' ' || "lastName"), ${query}::text) AS sim
      FROM "authors"
      WHERE similarity(("firstName" || ' ' || "lastName"), ${query}::text) > 0.3 
         OR ("firstName" || ' ' || "lastName") ILIKE ${searchTerms}::text
      UNION ALL
      SELECT b.id, b.title, (a."firstName" || ' ' || a."lastName") AS author, 'book' AS type,
             similarity(b.title, ${query}::text) AS sim
      FROM "books" b
      LEFT JOIN "authors" a ON b."authorId" = a.id
      WHERE similarity(b.title, ${query}::text) > 0.3 
         OR b.title ILIKE ${searchTerms}::text
      ORDER BY sim DESC LIMIT ${take}::int;
    `;

    return {
      status: 'success',
      results: suggestions.length,
      data: suggestions.map((s) => ({
        id: s.id,
        title: s.title,
        author: s.author,
        type: s.type,
      })),
    };
  }
}
