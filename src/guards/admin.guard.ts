import { CanActivate, ExecutionContext } from '@nestjs/common';
import { RequestWithSession } from 'src/users/interceptors/current-user.interceptor';

export class AdminGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const req = context.switchToHttp().getRequest<RequestWithSession>();

        console.log(req.currentUser);
        console.log(req.session);

        return req.currentUser?.isAdmin ?? false;
    }
}
