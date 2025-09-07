import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from '../../entities';

@Controller('api/auth')
@UseGuards(ThrottlerGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {
    console.log('🔧 AuthController: ThrottlerGuard configuré');
  }

  @Get('test')
  test() {
    return { message: 'Auth module is working!' };
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @Throttle({ 'register-ip': {} }) // Utilise la config globale
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Throttle({
    'login-user': {}, // Utilise la config globale
    'login-ip': {}, // Utilise la config globale
  })
  async login(@Body() loginDto: LoginDto) {
    console.log('🔍 LOGIN: Tentative de connexion pour:', loginDto.email);
    return this.authService.login(loginDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@CurrentUser() user: User) {
    const validatedUser = await this.authService.validateUser({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
    return { user: validatedUser };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() _body: { refreshToken: string }) {
    return { message: 'Refresh endpoint working!' };
  }

  @Get('status')
  status() {
    return { message: 'Auth service is running' };
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @Throttle({ 'reset-password-ip': {} }) // Utilise la config globale
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @Throttle({ 'reset-password-ip': {} }) // Utilise la config globale
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }
}
