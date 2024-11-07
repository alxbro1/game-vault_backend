import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { getToken } from 'next-auth/jwt'

import { JWT_SECRET } from '../config/enviroments.config';
import { db } from '../config/db';
import { eq } from 'drizzle-orm';
import { users } from '../../db/schemas/users.schema';
@Injectable()
export class AuthGuard implements CanActivate {


  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest()

      const headerAuth = request.headers.authorization as  string

      const userId = headerAuth?.split(' ')[1]


      console.log(userId)
/*       const token = await getToken({ req:request, secret:JWT_SECRET });

      if (!token?.email) throw new UnauthorizedException(); */

      const user = await db.query.users.findFirst({
        where: eq(users.id, userId)
      })

      if (!user) throw new UnauthorizedException();

      request.user = user;
      return true; 
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
