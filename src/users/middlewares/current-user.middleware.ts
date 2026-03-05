import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { RequestWithSession } from '../interceptors/current-user.interceptor';
import { UsersService } from '../users.service';

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
    constructor(private usersService: UsersService) {}
    async use(req: RequestWithSession, res: Response, next: NextFunction) {
        const userId = req.session?.userId;

        const user = await this.usersService.findOne(userId);

        req.currentUser = user;

        next();
    }
}
