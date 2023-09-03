import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { Helpers } from './utils';
import { AppModule } from '../src/app.module';
import { UserFactory } from './factories/user.factory';
import { CredentialFactory } from './factories/credentials.factory';
import { NotesFactory } from './factories/notes.factory';
import { CardsFactory } from './factories/cards.factory';
import { faker } from '@faker-js/faker';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let helpers: Helpers;
  let server: request.SuperTest<request.Test>;
  let userFactory: UserFactory;
  let credentialsFactory: CredentialFactory;
  let notesFactory: NotesFactory;
  let cardsFactory: CardsFactory;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [
        Helpers,
        UserFactory,
        CredentialFactory,
        NotesFactory,
        CardsFactory,
      ],
    }).compile();

    helpers = moduleFixture.get<Helpers>(Helpers);
    userFactory = moduleFixture.get<UserFactory>(UserFactory);
    credentialsFactory =
      moduleFixture.get<CredentialFactory>(CredentialFactory);
    notesFactory = moduleFixture.get<NotesFactory>(NotesFactory);
    cardsFactory = moduleFixture.get<CardsFactory>(CardsFactory);

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

  describe('/users/erase', () => {
    describe('should return 401', () => {
      it('when authorization is missing on headers', async () => {
        const { status } = await server.delete('/users/erase');
        expect(status).toBe(401);
      });

      it('when token has a invalid signature', async () => {
        const token = faker.lorem.word(15);

        const { status } = await server
          .delete('/users/erase')
          .set('Authorization', `Bearer ${token}`);
        expect(status).toBe(401);
      });

      it('when token is not bearer token', async () => {
        const token = faker.lorem.word(15);

        const { status } = await server
          .delete('/users/erase')
          .set('Authorization', `${token}`);
        expect(status).toBe(401);
      });

      it('when user password is wrong', async () => {
        const user = await userFactory.create({ password: 'S3nh@F@rt!2' });
        const token = await helpers.generateToken(user);

        const { status } = await server
          .delete('/users/erase')
          .send({
            password: 'S3nhaerrada',
          })
          .set('Authorization', `Bearer ${token}`);

        expect(status).toBe(401);
      });
    });

    it('should erase all data from user', async () => {
      const user = await userFactory.create({ password: 'S3nh@F@rt!2' });
      const token = await helpers.generateToken(user);
      await credentialsFactory.create(user.id, 'credential 1');
      await notesFactory.create(user.id, 'note 1');
      await cardsFactory.create(user.id, 'card 1');

      const { status } = await server
        .delete('/users/erase')
        .send({
          password: 'S3nh@F@rt!2',
        })
        .set('Authorization', `Bearer ${token}`);

      const userRecords = await userFactory.getAllRecordsFromUser(user.id);

      expect(status).toBe(200);
      expect(userRecords.cards).toBe(0);
      expect(userRecords.credentials).toBe(0);
      expect(userRecords.notes).toBe(0);
    });
  });
});
