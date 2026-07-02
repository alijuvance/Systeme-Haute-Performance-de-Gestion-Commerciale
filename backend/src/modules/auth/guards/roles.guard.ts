import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../../../common/decorators/roles.decorator';
import { PrismaService } from '../../../core/prisma/prisma.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // Si pas de rôles définis, on autorise l'accès.
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user || !user.roleId) return false;

    // Récupérer le nom du rôle
    const role = await this.prisma.role.findUnique({
      where: { id: user.roleId },
    });

    if (!role) return false;

    // ADMIN a accès à tout
    if (role.name === 'ADMIN') return true;

    // Vérifie si le nom du rôle de l'utilisateur fait partie des rôles requis
    return requiredRoles.includes(role.name);
  }
}
