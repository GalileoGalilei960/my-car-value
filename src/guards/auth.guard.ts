import { CanActivate, ExecutionContext } from '@nestjs/common';
import { RequestWithSession } from 'src/users/interceptors/current-user.interceptor';

export class AuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const req = context.switchToHttp().getRequest<RequestWithSession>();

        const userId = req.session?.userId;

        return !!userId;
    }
}
