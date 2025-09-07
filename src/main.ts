import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { SecurityConfigService } from './security/security-config.service';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Récupération du service de configuration de sécurité
  const securityConfigService = app.get(SecurityConfigService);

  // Application des configurations de sécurité
  app.use(helmet(securityConfigService.getHelmetConfig()));
  app.enableCors(securityConfigService.getCorsConfig());

  console.log('✅ Configuration de sécurité appliquée:', {
    helmet: 'configuré',
    cors: 'configuré',
    environment: securityConfigService.isProduction()
      ? 'production'
      : 'development',
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
