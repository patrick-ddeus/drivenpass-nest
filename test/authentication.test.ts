import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { Helpers } from './utils';
import { AppModule } from '../src/app.module';
import { UserFactory } from './factories/user.factory';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let helpers: Helpers;
  let server: request.SuperTest<request.Test>;
  let userFactory: UserFactory;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [Helpers, UserFactory],
    }).compile();

    helpers = moduleFixture.get<Helpers>(Helpers);
    userFactory = moduleFixture.get<UserFactory>(UserFactory);

    await helpers.cleanDb();
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    server = request(app.getHttpServer());
  });

  describe('/users/sign-up (POST)', () => {
    describe('should return 400', () => {
      it('when body is missing', async () => {
        const { status } = await server.post('/users/sign-up');
        expect(status).toBe(400);
      });

      it('when email is invalid', async () => {
        const { status } = await server
          .post('/users/sign-up')
          .send({ email: 'emailinvalido' });
        expect(status).toBe(400);
      });

      it('when password is weak', async () => {
        const { status } = await server
          .post('/users/sign-up')
          .send({ email: 'teste@teste.com', password: 'senhafraca' });
        expect(status).toBe(400);
      });
    });
    describe('should return 409', () => {
      it('when email is already registered!', async () => {
        const user = await userFactory.create();
        const { status } = await server
          .post('/users/sign-up')
          .send({ email: user.email, password: 'S3nhaF@rt&' });

        expect(status).toBe(409);
      });
    });

    describe('should return 201', () => {
      it('when body is valid', async () => {
        const { status } = await server
          .post('/users/sign-up')
          .send({ email: 'teste@teste.com', password: 'S3nhaF@rt&' });
        expect(status).toBe(201);
      });
    });
  });

  describe('/users/sign-in (POST)', () => {
    describe('should return 400', () => {
      it('when body is missing', async () => {
        const { status } = await server.post('/users/sign-in');
        expect(status).toBe(400);
      });

      it('when email is invalid', async () => {
        const { status } = await server
          .post('/users/sign-in')
          .send({ email: 'emailinvalido' });
        expect(status).toBe(400);
      });
    });
    describe('should return 401', () => {
      it("when account doesn't exists", async () => {
        const { status } = await server
          .post('/users/sign-in')
          .send({ email: 'fulano@gmail.com', password: 'S3nhaF@rt&' });

        expect(status).toBe(401);
      });
    });

    describe('should return 200', () => {
      it('when user exists', async () => {
        const { status, body } = await server
          .post('/users/sign-in')
          .send({ email: 'teste@teste.com', password: 'S3nhaF@rt&' });
        expect(status).toBe(200);
        expect(body).toEqual({
          access_token: expect.any(String),
        });
      });
    });
  });
});
