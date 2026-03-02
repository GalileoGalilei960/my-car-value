import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('Authentiaction', () => {
    let app: INestApplication<App>;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('Signs up user correctly', () => {
        return request(app.getHttpServer())
            .post('/auth/signup')
            .send({
                email: 'test@gmail.com',
                password: 'ostap',
            })
            .expect(201)
            .then((res) => {
                const { id, email, password } = res.body as {
                    id: number;
                    email: string;
                    password: string;
                };
                expect(email).toBe('test@gmail.com');
                expect(id).toBeDefined();
                expect(password).not.toBeDefined();
            });
    });

    it('signs up new user and the checks currently logged in user', async () => {
        const signUpRes = await request(app.getHttpServer())
            .post('/auth/signup')
            .send({
                email: 'test@gmail.com',
                password: 'ostap',
            })
            .expect(201);

        const { id, email, password } = signUpRes.body as {
            id: number;
            email: string;
            password: string;
        };

        expect(email).toBe('test@gmail.com');
        expect(id).toBeDefined();
        expect(password).not.toBeDefined();

        const cookie = signUpRes.get('Set-Cookie');

        expect(cookie).toBeDefined();

        const whoAmIRes = await request(app.getHttpServer())
            .get('/auth/whoami')
            .set({ Cookie: cookie })
            .expect(200);

        const whoAmIResBody = whoAmIRes.body as {
            id: number;
            email: string;
            password: string;
        };

        expect(whoAmIResBody.email).toBe('test@gmail.com');
        expect(whoAmIResBody.id).toBeDefined();
        expect(whoAmIResBody.password).not.toBeDefined();
    });
});
