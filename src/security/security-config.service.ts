import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createSecurityConfig, SecurityConfig } from '../config/security.config';

@Injectable()
export class SecurityConfigService {
  private readonly config: SecurityConfig;

  constructor(private readonly configService: ConfigService) {
    this.config = createSecurityConfig(configService);
  }

  getHelmetConfig() {
    return this.config.helmet;
  }

  getCorsConfig() {
    return this.config.cors;
  }

  getRateLimitConfig() {
    return this.config.rateLimit;
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
