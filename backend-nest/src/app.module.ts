import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { BookModule } from './book/book.module';
import { CartModule } from './cart/cart.module';
import { SearchModule } from './search/search.module';
import { AuthorModule } from './author/author.module';
import { GenresModule } from './genres/genres.module';
import { OrdersModule } from './orders/orders.module';
import { FileModule } from './common/file/file.module';
import { CatalogModule } from './catalog/catalog.module';
import { ReviewsModule } from './reviews/reviews.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    BookModule,
    CartModule,
    SearchModule,
    AuthorModule,
    GenresModule,
    OrdersModule,
    FileModule,
    CatalogModule,
    ReviewsModule,
  ],
})
export class AppModule {}
