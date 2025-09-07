import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../users/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { PasswordResetToken } from './password-reset-token.entity';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

export interface JwtPayload {
  sub: number;
  email: string;
  role: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(PasswordResetToken)
    private readonly passwordResetTokenRepository: Repository<PasswordResetToken>,
    private readonly jwtService: JwtService,
  ) {}

  async register(
    registerDto: RegisterDto,
  ): Promise<{ user: Partial<User>; token: string }> {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Un utilisateur avec cet email existe déjà');
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Créer le nouvel utilisateur
    const user = this.userRepository.create({
      ...registerDto,
      password: hashedPassword,
      role: registerDto.role || UserRole.GUEST, // Par défaut, les nouveaux utilisateurs sont des voyageurs
    });

    const savedUser = await this.userRepository.save(user);

    // Générer le token JWT
    const token = this.generateToken(savedUser);

    // Retourner l'utilisateur sans le mot de passe
    const { password: _password, ...userWithoutPassword } = savedUser;
    return { user: userWithoutPassword, token };
  }

  async login(
    loginDto: LoginDto,
  ): Promise<{ user: Partial<User>; token: string }> {
    // Trouver l'utilisateur par email (avec le mot de passe pour la validation)
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
      select: [
        'id',
        'email',
        'password',
        'firstname',
        'name',
        'avatar',
        'role',
        'createdAt',
        'updatedAt',
      ],
    });

    if (!user) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    // Valider le mot de passe avec bcrypt
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    // Générer le token JWT
    const token = this.generateToken(user);

    // Retourner l'utilisateur sans le mot de passe
    const { password: _password, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  async validateUser(payload: JwtPayload): Promise<User> {
    console.log('🔍 Validation du token JWT avec payload:', payload);

    const user = await this.userRepository.findOne({
      where: { id: payload.sub },
    });

    if (!user) {
      console.log("❌ Utilisateur non trouvé pour l'ID:", payload.sub);
      throw new UnauthorizedException('Utilisateur non trouvé');
    }

    console.log('✅ Utilisateur validé:', {
      id: user.id,
      email: user.email,
      role: user.role,
    });
    return user;
  }

  private generateToken(user: User): string {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
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

  async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto,
  ): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({
      where: { email: forgotPasswordDto.email },
    });

    if (!user) {
      // Pour des raisons de sécurité, on ne révèle pas si l'email existe ou non
      return {
        message:
          'Si cet email existe, un lien de réinitialisation a été envoyé',
      };
    }

    // Générer un token unique
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // Expire dans 1 heure

    // Supprimer les anciens tokens pour cet utilisateur
    await this.passwordResetTokenRepository.delete({ userId: user.id });

    // Créer un nouveau token
    const passwordResetToken = this.passwordResetTokenRepository.create({
      token,
      userId: user.id,
      expiresAt,
    });

    await this.passwordResetTokenRepository.save(passwordResetToken);

    // TODO: Envoyer l'email avec le lien de réinitialisation
    // Pour l'instant, on retourne juste le token (à supprimer en production)
    console.log(`Token de réinitialisation pour ${user.email}: ${token}`);

    return {
      message: 'Si cet email existe, un lien de réinitialisation a été envoyé',
    };
  }

  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    const passwordResetToken = await this.passwordResetTokenRepository.findOne({
      where: { token: resetPasswordDto.token },
      relations: ['user'],
    });

    if (!passwordResetToken) {
      throw new BadRequestException('Token de réinitialisation invalide');
    }

    if (passwordResetToken.used) {
      throw new BadRequestException('Ce token a déjà été utilisé');
    }

    if (passwordResetToken.expiresAt < new Date()) {
      throw new BadRequestException('Ce token a expiré');
    }

    // Hasher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(resetPasswordDto.password, 10);

    // Mettre à jour le mot de passe de l'utilisateur
    await this.userRepository.update(passwordResetToken.userId, {
      password: hashedPassword,
    });

    // Marquer le token comme utilisé
    await this.passwordResetTokenRepository.update(passwordResetToken.id, {
      used: true,
    });

    return { message: 'Mot de passe réinitialisé avec succès' };
  }
}
