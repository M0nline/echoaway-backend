import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlingConfigService } from './throttling-config.service';

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useClass: ThrottlingConfigService,
    }),
  ],
  providers: [ThrottlingConfigService],
  exports: [ThrottlerModule],
})
export class ThrottlingModule {}
