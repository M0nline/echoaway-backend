import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { accommodationsModule } from './accommodations/accommodations.module';

@Module({
  imports: [accommodationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
