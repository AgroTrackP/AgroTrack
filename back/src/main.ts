import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import express from 'express';
import { auth } from 'express-openid-connect';
import { config as auth0Config } from './Config/auth0.config';
import { runSeeders } from './Modules/seed';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Ejecutar seeders solo en desarrollo
  if (process.env.NODE_ENV === 'development') {
    await runSeeders();
  }
  // Asegura que el CORS esté habilitado con un origen explícito para el frontend
  app.enableCors();

  // Middleware de Auth0 para express
  app.use(auth(auth0Config));

  // Middleware para el webhook de Stripe
  app.use('/stripe/webhook', express.raw({ type: 'application/json' }));

  // Middleware de validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('AgroTrack API')
    .setDescription('Backend para el sistema de gestión AgroTrack. Ofrece endpoints para la administración de usuarios (Auth0/JWT), gestión de inventario de productos agrícolas, planificación de tareas mediante calendario y procesamiento de pagos y suscripciones. Arquitectura modular construida con NestJS, TypeORM y PostgreSQL.')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
      },
      'jwt',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3010);
  console.log(`🚀 Server running on: ${await app.getUrl()}`);
}
void bootstrap();
