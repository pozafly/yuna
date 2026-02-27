import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true
    })
  );

  app.enableCors({
    origin: process.env.APP_URL ?? 'http://localhost:3001',
    credentials: true
  });

  const port = Number(process.env.API_PORT ?? '3000');
  await app.listen(port);
}

void bootstrap();
