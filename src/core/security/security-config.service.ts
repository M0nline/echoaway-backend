import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  createSecurityConfig,
  SecurityConfig,
} from '../../config/security.config';

@Injectable()
export class SecurityConfigService {
  private readonly config: SecurityConfig;

  constructor(private readonly configService: ConfigService) {
    console.log('🔐 SecurityConfigService: Initializing security configuration...');
    console.log('🔧 SecurityConfigService: Environment variables:', {
      NODE_ENV: this.configService.get('NODE_ENV'),
      FRONTEND_URL: this.configService.get('FRONTEND_URL'),
    });
    
    try {
      this.config = createSecurityConfig(configService);
      console.log('✅ SecurityConfigService: Security configuration created successfully');
    } catch (error) {
      console.error('❌ SecurityConfigService: Error creating security configuration:', error);
      throw error;
    }
  }

  getHelmetConfig() {
    console.log('🛡️ SecurityConfigService: Getting Helmet configuration...');
    const helmetConfig = this.config.helmet;
    console.log('🔧 SecurityConfigService: Helmet config:', JSON.stringify(helmetConfig, null, 2));
    return helmetConfig;
  }

  getCorsConfig() {
    console.log('🌐 SecurityConfigService: Getting CORS configuration...');
    const corsConfig = this.config.cors;
    console.log('🔧 SecurityConfigService: CORS config:', JSON.stringify(corsConfig, null, 2));
    
    // 🔍 ENQUÊTE: Log détaillé de la config CORS
    console.log('🔍 ENQUÊTE CORS - Détails:', {
      origin: corsConfig.origin,
      methods: corsConfig.methods,
      allowedHeaders: corsConfig.allowedHeaders,
      credentials: corsConfig.credentials,
      preflightContinue: corsConfig.preflightContinue,
      optionsSuccessStatus: corsConfig.optionsSuccessStatus,
      isProduction: this.isProduction(),
      frontendUrl: this.configService.get('FRONTEND_URL')
    });
    
    return corsConfig;
  }

  getRateLimitConfig() {
    return this.config.rateLimit.throttlers;
  }

  getSecurityConfig(): SecurityConfig {
    return this.config;
  }

  isProduction(): boolean {
    return this.configService.get('NODE_ENV') === 'production';
  }

  getFrontendUrl(): string | undefined {
    return this.configService.get('FRONTEND_URL');
  }
}
