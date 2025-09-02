import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('status')
  getStatus() {
    return { status: 'API is running 🚀' };
  }
}
