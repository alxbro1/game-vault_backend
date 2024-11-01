import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { getToken } from 'next-auth/jwt'

import { JWT_SECRET } from '../config/enviroments.config';
@Injectable()
export class AuthGuard implements CanActivate {


  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest() as any;

      const token = await getToken({ req:request, secret:JWT_SECRET });

      if (!token) throw new UnauthorizedException();

      request.user = token.user;
      return true; 
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
