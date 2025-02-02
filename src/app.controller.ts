import { Controller, Get } from '@nestjs/common';

@Controller('api')
export class AppController {
  @Get('status')
  getStatus() {
    return { status: 'API is running 🚀' };
  }
}
