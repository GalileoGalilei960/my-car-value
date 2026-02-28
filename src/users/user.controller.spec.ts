import { Test, TestingModule } from '@nestjs/testing';
import UsersController from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './users.entity';

describe('User controller', () => {
    let controller: Partial<UsersController> = {};
    let usersService: Partial<UsersService> = {};
    let authService: Partial<AuthService> = {};

    beforeEach(async () => {
        usersService = {
            findOne: (id: number | undefined) => {
                return Promise.resolve({
                    id,
                    email: 'test@test.com',
                    password: 'test_password',
                } as User | null);
            },
            find: (email: string) => {
                return Promise.resolve({
                    id: 1,
                    email,
                    password: 'test_password',
                } as User | null);
            },
            // delete = ()=>{},
            // update = ()=>{}
        };

        authService = {
            // signUp: () => {},
            // signIn: () => {},
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [
                {
                    provide: UsersService,
                    useValue: usersService,
                },
                {
                    provide: AuthService,
                    useValue: authService,
                },
            ],
        }).compile();

        controller = module.get<UsersController>(UsersController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
