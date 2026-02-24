import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UsersService } from '../users.service';
import { Request } from 'express';
import { User } from '../users.entity';

export interface RequestWithSession extends Request {
    session?: {
        userId: number;
    };
    currentUser?: User | null;
}

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
    constructor(private usersService: UsersService) {}

    async intercept(
        context: ExecutionContext,
        next: CallHandler<any>,
    ): Promise<Observable<any>> {
        const req = context.switchToHttp().getRequest<RequestWithSession>();

        const userId = req.session?.userId;

        const user = await this.usersService.findOne(userId);

        req.currentUser = user;

        return next.handle();
    }
}
