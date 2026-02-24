import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestWithSession } from '../interceptors/current-user.interceptor';
import { User } from '../users.entity';

export const CurrentUser = createParamDecorator(
    (data: never, context: ExecutionContext): User | null => {
        const request = context.switchToHttp().getRequest<RequestWithSession>();
        return request.currentUser ?? null;
    },
);
