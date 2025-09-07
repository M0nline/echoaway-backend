import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../../entities';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<UserRole[]>(
      'roles',
      context.getHandler(),
    );
    if (!requiredRoles) {
      return true; // Pas de rôle requis = accès public
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user) {
      return false; // Pas d'utilisateur = accès refusé
    }

    return requiredRoles.some((role) => {
      if (role === UserRole.ADMIN && user.isAdmin()) return true;
      if (role === UserRole.HOST && user.isHost()) return true;
      if (role === UserRole.GUEST && user.isGuest()) return true;
      if (role === UserRole.VISITOR) return true;
      return false;
    });
  }
}
