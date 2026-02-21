import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';
import { User } from './users.entity';

const scryptAsync = promisify(scrypt);

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) {}

    async signUp(email: string, password: string): Promise<User> {
        const user = await this.usersService.find(email);

        if (user) throw new BadRequestException('email in use');

        const salt = randomBytes(16).toString('hex');

        const hashedBuffer = (await scryptAsync(password, salt, 32)) as Buffer;
        const hashedPassword = hashedBuffer.toString('hex');

        const resultPassword = salt + '.' + hashedPassword;

        const newUser = await this.usersService.create(email, resultPassword);

        return newUser;
    }

    async signIn(email: string, password: string): Promise<User> {
        const user = await this.usersService.find(email);

        if (!user) {
            await scryptAsync('time', 'delay', 32);
            throw new UnauthorizedException('incorrect credentials');
        }

        const [salt, hashedPassword] = user.password.split('.');

        const providedHashedPasswordBuffer = (await scryptAsync(
            password,
            salt,
            32,
        )) as Buffer;

        const providedHashedPassword =
            providedHashedPasswordBuffer.toString('hex');

        if (providedHashedPassword !== hashedPassword)
            throw new UnauthorizedException('incorrect credentials');

        return user;
    }
}
