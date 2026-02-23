import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const Cookie = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();

    const cookies = request.cookies as
      | Record<string, string | undefined>
      | undefined;

    if (!cookies) return null;

    return data ? cookies[data] : cookies;
  },
);
