import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayloadWithRt } from '../../modules/auth/types/jwt-payload.type';

export const CurrentUser = createParamDecorator(
  (data: keyof JwtPayloadWithRt | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    if (!data) return request.user;
    return request.user[data];
  },
);
