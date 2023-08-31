import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../users/auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { authorization } = request.headers;

    if (!authorization) throw new UnauthorizedException('Invalid Token!');

    const parts = authorization.split(' ');

    if (parts.length !== 2) throw new UnauthorizedException('Invalid Token!');

    const [schema, token] = parts;

    if (schema !== 'Bearer') throw new UnauthorizedException('Invalid Token!');

    try {
      await this.authService.validateToken(token);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
