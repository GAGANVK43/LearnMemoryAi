import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  // Environment Validation on Startup
  const port = process.env.PORT || 4000;
  const webUrl = process.env.WEB_URL || 'http://localhost:3000';
  
  if (!process.env.JWT_SECRET) {
    logger.warn('JWT_SECRET is not set in environment. Falling back to default secret.');
  }

  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.use(cookieParser());
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    })
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  app.enableCors({
    origin: [webUrl, 'http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  await app.listen(port);
  logger.log(`🚀 LearnMemory AI API is running on: http://localhost:${port}/api`);
}
bootstrap();
