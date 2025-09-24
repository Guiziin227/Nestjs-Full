import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Roles } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';
import { CaslAbilityService } from '../casl/casl-ability/casl-ability.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
    private abilityService: CaslAbilityService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const token = request.headers['authorization']?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const payload = await this.jwtService.verify<{
        name: string;
        email: string;
        role: Roles;
        sub: string;
      }>(token, {
        algorithms: ['HS256'],
      });
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      request.user = user;

      this.abilityService.createForUser(user);

      return true;
    } catch (err) {
      console.error(err);
      throw new UnauthorizedException('Invalid token', { cause: err });
    }

    return true;
  }
}
