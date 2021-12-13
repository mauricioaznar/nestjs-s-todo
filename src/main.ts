import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: false, // white list should be false otherwise fields that are not specified in 'class validator' are going to get filtered
      transform: true,
    }),
  );
  await app.listen(3005);
}

bootstrap();
