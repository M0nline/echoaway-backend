import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('status')
  getStatus() {
    console.log('🔍 ENQUÊTE - Début de getStatus()...');
    const response = { status: 'API is running 🚀' };
    console.log('🔍 ENQUÊTE - getStatus() terminé, retour:', response);
    return response;
  }
}
