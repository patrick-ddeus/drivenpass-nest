import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticatedRoute } from '../guards/auth.guard';

export const User = createParamDecorator(
  (data: string, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<AuthenticatedRoute>();
    const user = request.user;
    return data ? user?.[data] : user;
  },
);
