import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS - Configuration flexible pour dev/prod
  const allowedOrigins = [
    'http://localhost:3000',           // Développement local
    'http://localhost:3001',           // Développement local (alternative)
    process.env.FRONTEND_URL,          // Production (si défini)
  ].filter(Boolean); // Retire les valeurs undefined

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Validation globale
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📡 API available at: http://localhost:${port}`);
}
bootstrap();
