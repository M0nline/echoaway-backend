import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../users/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

export interface JwtPayload {
  sub: number;
  login: string;
  role: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<{ user: Partial<User>; token: string }> {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await this.userRepository.findOne({
      where: { login: registerDto.login },
    });

    if (existingUser) {
      throw new ConflictException('Un utilisateur avec ce login existe déjà');
    }

    // Créer le nouvel utilisateur
    const user = this.userRepository.create({
      ...registerDto,
      role: registerDto.role || UserRole.VISITOR,
    });

    const savedUser = await this.userRepository.save(user);

    // Générer le token JWT
    const token = this.generateToken(savedUser);

    // Retourner l'utilisateur sans le mot de passe
    const { password, ...userWithoutPassword } = savedUser;
    return { user: userWithoutPassword, token };
  }

  async login(loginDto: LoginDto): Promise<{ user: Partial<User>; token: string }> {
    // Trouver l'utilisateur par login
    const user = await this.userRepository.findOne({
      where: { login: loginDto.login },
    });

    if (!user) {
      throw new UnauthorizedException('Login ou mot de passe incorrect');
    }

    // Valider le mot de passe (comparaison directe pour l'instant)
    const isPasswordValid = loginDto.password === user.password;
    if (!isPasswordValid) {
      throw new UnauthorizedException('Login ou mot de passe incorrect');
    }

    // Générer le token JWT
    const token = this.generateToken(user);

    // Retourner l'utilisateur sans le mot de passe
    const { password, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  async validateUser(payload: JwtPayload): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: payload.sub },
    });

    if (!user) {
      throw new UnauthorizedException('Utilisateur non trouvé');
    }

    return user;
  }

  private generateToken(user: User): string {
    const payload: JwtPayload = {
      sub: user.id,
      login: user.login,
      role: user.role,
    };

    return this.jwtService.sign(payload);
  }

  async refreshToken(userId: number): Promise<{ token: string }> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('Utilisateur non trouvé');
    }

    const token = this.generateToken(user);
    return { token };
  }
}
