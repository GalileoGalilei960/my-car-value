import { Test } from '@nestjs/testing';
import { AuthService, scryptAsync } from './auth.service';
import { UsersService } from './users.service';
import { User } from './users.entity';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

let authService: AuthService;
let fakeUsersService: Partial<UsersService>;
let users: User[] = [];

describe('AuthService', () => {
    beforeEach(async () => {
        users = [];
        fakeUsersService = {
            find: (email: string) => {
                const user = users.find((user: User) => {
                    return user.email === email;
                });

                return Promise.resolve(user || null);
            },
            create: (email: string, password: string) => {
                const user = {
                    id: Math.floor(Math.random() * 10 ** 16),
                    email,
                    password,
                } as User;

                users.push(user);

                return Promise.resolve(user);
            },
        };

        const module = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UsersService,
                    useValue: fakeUsersService,
                },
            ],
        }).compile();

        authService = module.get(AuthService);
    });

    it('creates an instance of AuthService', () => {
        expect(authService).toBeDefined();
    });

    it('hashes passwords correctly', async () => {
        const user = await authService.signUp('test@test.com', 'test_password');

        expect(user).toBeDefined();
        expect(user.password).not.toBe('test_password');

        const [salt, hash] = user.password.split('.');

        expect(salt).toBeDefined();
        expect(hash).toBeDefined();

        const hashedBuffer = (await scryptAsync(
            'test_password',
            salt,
            32,
        )) as Buffer;
        const hashedPassword = hashedBuffer.toString('hex');

        const resultPassword = salt + '.' + hashedPassword;

        expect(resultPassword).toBe(user.password);
    });

    it('throws an error when user signs up witn email in use', async () => {
        await authService.signUp('test@test.com', 'test_password');

        await expect(
            authService.signUp('test@test.com', 'test_password'),
        ).rejects.toThrow(BadRequestException);
    });

    it('throws an error when user signs in with not existing email', async () => {
        await expect(
            authService.signIn('test@test.com', 'test_password'),
        ).rejects.toThrow(UnauthorizedException);
    });

    it('throws an error when user signs in with incorrect password', async () => {
        await authService.signUp('test@test.com', 'test_password');

        await expect(
            authService.signIn('test@test.com', 'not equal to test_password'),
        ).rejects.toThrow(UnauthorizedException);
    });

    it('signs in user if provided password is correct', async () => {
        await authService.signUp('test@test.com', 'test_password');

        const user = await authService.signIn('test@test.com', 'test_password');

        expect(user).toBeDefined();
    });
});
