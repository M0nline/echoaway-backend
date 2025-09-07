import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService, JwtPayload } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>(
        'JWT_SECRET',
        'your-super-secret-key',
      ),
    });
  }

  async validate(payload: JwtPayload) {
    console.log('🔐 JWT Strategy - Validation du payload:', payload);
    const user = await this.authService.validateUser(payload);
    if (!user) {
      console.log('❌ JWT Strategy - Utilisateur non trouvé');
      throw new UnauthorizedException();
    }
    console.log('✅ JWT Strategy - Utilisateur validé:', {
      id: user.id,
      email: user.email,
    });
    return user;
  }
}
