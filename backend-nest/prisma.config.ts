import 'dotenv/config';
import { defineConfig } from '@prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    // Добавляем вот эту строку:
    seed: 'ts-node seed.ts',
  },
  datasource: {
    url: process.env['DATABASE_URL'],
  },
});
