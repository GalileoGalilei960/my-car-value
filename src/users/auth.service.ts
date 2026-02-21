import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) {}

    async signUp(email: string, password: string) {
        const users = await this.usersService.find(email);

        if (users.length !== 0) throw new BadRequestException('email in use');

        const salt = randomBytes(8).toString('hex');

        const hashedBuffer = (await scryptAsync(password, salt, 32)) as Buffer;
        const hashedPassword = hashedBuffer.toString('hex');

        const resultPassword = hashedPassword + '.' + salt;

        const newUser = await this.usersService.create(email, resultPassword);

        return newUser;
    }
}
