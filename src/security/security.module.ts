import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SecurityConfigService } from './security-config.service';

@Module({
  imports: [ConfigModule],
  providers: [SecurityConfigService],
  exports: [SecurityConfigService],
})
export class SecurityModule {}
