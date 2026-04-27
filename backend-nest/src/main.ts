import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { FileUrlInterceptor } from './common/interceptors/file-url.interceptor';
import { shouldServeLocalUploads } from './common/file/file-storage.config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix('api');

  if (shouldServeLocalUploads()) {
    app.useStaticAssets(join(process.cwd(), 'uploads'), {
      prefix: '/uploads/',
    });
  }

  app.useGlobalInterceptors(new FileUrlInterceptor());
  app.use(cookieParser());

  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const port = Number(process.env.PORT) || 4000;
  await app.listen(port);

  console.log(`🚀 Nest server is running on port ${port}`);
  if (shouldServeLocalUploads()) {
    console.log(
      `📂 Static files available at: http://localhost:${port}/uploads/`,
    );
  }
}
void bootstrap();
