import { Test, TestingModule } from '@nestjs/testing';
import UsersController, { SecureSession } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './users.entity';

describe('User controller', () => {
    let controller: UsersController;
    let usersService: Partial<UsersService> = {};
    let authService: Partial<AuthService> = {};

    beforeEach(async () => {
        usersService = {
            findOne: (id: number | undefined) => {
                if (!id) return Promise.resolve(null);

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
            signUp: (email: string, password: string) => {
                return Promise.resolve({ id: 1, email, password } as User);
            },
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

    it('getUserById finds user by id', async () => {
        const user = await controller.getUserById(1);

        expect(user).toBeDefined();
        expect(user?.id).toEqual(1);
    });

    it('getUserById returns null when id is undefined', async () => {
        const user = await controller.getUserById(
            undefined as unknown as number,
        );

        expect(user).toEqual(null);
    });

    it('getUserByEmail finds user by email', async () => {
        const user = await controller.getUserByEmail({
            email: 'test@test.com',
        });

        expect(user).toBeDefined();
        expect(user?.email).toEqual('test@test.com');
    });

    it('signIn returns user and sets session object', async () => {
        const session: SecureSession = {};

        const user = await controller.signUp(
            {
                email: 'test@test.com',
                password: 'test_password',
            },
            session,
        );

        expect(user).toBeDefined();

        expect(user.email).toEqual('test@test.com');
        expect(user.password).toEqual('test_password');

        expect(session.userId).toEqual(1);
    });
});
