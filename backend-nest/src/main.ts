import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { join } from 'path';

import { AppModule } from './app.module';
import { FileUrlInterceptor } from './common/interceptors/file-url.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      crossOriginEmbedderPolicy: { policy: 'credentialless' },
    }),
  );
  app.use(cookieParser());

  app.setGlobalPrefix('api');
  app.useGlobalInterceptors(new FileUrlInterceptor());

  const clientUrl =
    configService.get<string>('CLIENT_URL') || 'http://localhost:5173';
  app.enableCors({
    origin: clientUrl,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const staticPath = configService.get<string>('STATIC_PATH') || 'uploads';
  app.useStaticAssets(join(process.cwd(), staticPath), {
    prefix: `/${staticPath}/`,
  });

  const config = new DocumentBuilder()
    .setTitle('Diplom API')
    .setDescription('Документация бэкенда для диплома')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = configService.get<number>('PORT') || 4000;
  await app.listen(port);

  logger.log(`🚀 Server running on http://localhost:${port}/api`);
  logger.log(`📄 Swagger docs: http://localhost:${port}/api/docs`);
}

void bootstrap();
