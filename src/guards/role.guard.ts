import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { enumRole } from '../enums/role.enum';
@Injectable()
export class IsAdminGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const role = context.switchToHttp().getRequest().user.role;

    const requestRole = this.reflector.getAllAndOverride<enumRole>('role', [
      context.getHandler(),
      context.getClass(),
    ]);
    console.log(requestRole);
    return role == requestRole;
  }
}
