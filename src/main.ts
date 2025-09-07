import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { SecurityConfigService } from './security/security-config.service';
import helmet from 'helmet';

async function bootstrap() {
  console.log('🚀 Starting EchoAway Backend...');
  console.log('🔧 Environment variables:', {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DB_NAME: process.env.DB_NAME,
    DATABASE_URL: process.env.DATABASE_URL ? 'configured' : 'missing',
  });

  try {
    console.log('📦 Creating NestJS application...');
    const app = await NestFactory.create(AppModule);
    console.log('✅ NestJS application created successfully');

    // Récupération du service de configuration de sécurité
    console.log('🔐 Getting security configuration service...');
    const securityConfigService = app.get(SecurityConfigService);
    console.log('✅ Security configuration service obtained');

    // Application des configurations de sécurité
    console.log('🛡️ Applying security configurations...');
    const helmetConfig = securityConfigService.getHelmetConfig();
    const corsConfig = securityConfigService.getCorsConfig();
    
    console.log('🔧 Helmet config:', JSON.stringify(helmetConfig, null, 2));
    console.log('🔧 CORS config:', JSON.stringify(corsConfig, null, 2));
    
    app.use(helmet(helmetConfig));
    app.enableCors(corsConfig);
    console.log('✅ Security configurations applied successfully');

    console.log('✅ Configuration de sécurité appliquée:', {
      helmet: 'configuré',
      cors: 'configuré',
      environment: securityConfigService.isProduction()
        ? 'production'
        : 'development',
    });

    // Validation globale
    console.log('🔍 Setting up global validation pipes...');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    console.log('✅ Global validation pipes configured');

    const port = process.env.PORT || 3001;
    console.log(`🌐 Starting server on port ${port}...`);
    
    await app.listen(port);
    console.log(`🚀 Application is running on: http://localhost:${port}`);
    console.log(`📡 API available at: http://localhost:${port}`);
    console.log(`🔍 Health check available at: http://localhost:${port}/status`);
    
  } catch (error) {
    console.error('❌ Error during application startup:', error);
    console.error('❌ Error stack:', error.stack);
    process.exit(1);
  }
}
bootstrap();
