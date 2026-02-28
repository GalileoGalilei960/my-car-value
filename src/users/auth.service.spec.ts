import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './users.entity';

let authService: UsersService;

describe('AuthService', () => {
    beforeEach(async () => {
        const fakeUsersService: Partial<UsersService> = {
            find: (email: string) => Promise.resolve({} as User | null),
            create: (email: string, password: string) =>
                Promise.resolve({ id: 1, email, password } as User),
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

    it('can create an instance of AuthService', () => {
        expect(authService).toBeDefined();
    });
});
