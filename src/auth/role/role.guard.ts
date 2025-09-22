import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Roles } from 'generated/prisma';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    //roles pq no setMetadata foi usado 'roles'
    const requiredRoles = this.reflector.get<Roles[]>(
      'roles',
      context.getHandler(),
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true; //se nao tiver roles requeridas, libera o acesso
    }

    const request: Request = context.switchToHttp().getRequest();
    const authUser = request.user;

    return (
      authUser!.role === Roles.ADMIN || requiredRoles.includes(authUser!.role)
    );
  }
}
