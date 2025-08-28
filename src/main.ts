import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove as chaves que não estão validadas no DTO
      forbidNonWhitelisted: true, // Enviar um erro quando a chave ñ existir
      transform: false, // tenta transformar os tipos de dados de params e DTOs }
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
