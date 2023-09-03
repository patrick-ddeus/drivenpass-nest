import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { Helpers } from './utils';
import { AppModule } from '../src/app.module';
import { UserFactory } from './factories/user.factory';
import { CredentialFactory } from './factories/credentials.factory';
import { faker } from '@faker-js/faker';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let helpers: Helpers;
  let server: request.SuperTest<request.Test>;
  let userFactory: UserFactory;
  let credentialFactory: CredentialFactory;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [Helpers, UserFactory, CredentialFactory],
    }).compile();

    helpers = moduleFixture.get<Helpers>(Helpers);
    userFactory = moduleFixture.get<UserFactory>(UserFactory);
    credentialFactory = moduleFixture.get<CredentialFactory>(CredentialFactory);

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    server = request(app.getHttpServer());
  });

  beforeEach(async () => {
    await helpers.cleanDb();
  });

  describe('/credentials (POST)', () => {
    describe('should return 400', () => {
      it('when body is missing', async () => {
        const user = await userFactory.create();
        const token = await helpers.generateToken(user);

        const { status } = await server
          .post('/credentials')
          .set('Authorization', `Bearer ${token}`);
        expect(status).toBe(400);
      });

      it('when body is invalid', async () => {
        const user = await userFactory.create();
        const token = await helpers.generateToken(user);

        const { status } = await server
          .post('/credentials')
          .send({ url: 'urlinvalida', username: 1234, password: '', title: '' })
          .set('Authorization', `Bearer ${token}`);
        expect(status).toBe(400);
      });

      it('when url is not a url', async () => {
        const user = await userFactory.create();
        const token = await helpers.generateToken(user);

        const { status } = await server
          .post('/credentials')
          .send({
            url: 'urlinvalida',
            username: 'uservalido',
            password: 'senhadacredentialvalida',
            title: '',
          })
          .set('Authorization', `Bearer ${token}`);
        expect(status).toBe(400);
      });

      it('when title is missing', async () => {
        const user = await userFactory.create();
        const token = await helpers.generateToken(user);

        const { status } = await server
          .post('/credentials')
          .send({
            url: faker.internet.url({ protocol: 'http' }),
            username: faker.internet.userName(),
            password: faker.internet.password(),
          })
          .set('Authorization', `Bearer ${token}`);
        expect(status).toBe(400);
      });
    });

    describe('should return 401', () => {
      it('when authorization is missing on headers', async () => {
        const { status } = await server.post('/credentials');
        expect(status).toBe(401);
      });

      it('when token has a invalid signature', async () => {
        const token = faker.lorem.word(15);

        const { status } = await server
          .post('/credentials')
          .set('Authorization', `Bearer ${token}`);
        expect(status).toBe(401);
      });

      it('when token is not bearer token', async () => {
        const token = faker.lorem.word(15);

        const { status } = await server
          .post('/credentials')
          .set('Authorization', `${token}`);
        expect(status).toBe(401);
      });
    });

    describe('should return 409', () => {
      it('when user tries to create a credential with same title', async () => {
        const user = await userFactory.create();
        const token = await helpers.generateToken(user);
        const credential = await credentialFactory.create(user.id, 'titulo');

        const { status } = await server
          .post('/credentials')
          .send(credentialFactory.build(credential.prisma.title))
          .set('Authorization', `Bearer ${token}`);

        expect(status).toBe(409);
      });
    });

    describe('should return 201', () => {
      it('when body is valid', async () => {
        const user = await userFactory.create();
        const token = await helpers.generateToken(user);

        const { status } = await server
          .post('/credentials')
          .send(credentialFactory.build())
          .set('Authorization', `Bearer ${token}`);
        expect(status).toBe(201);
      });
    });
  });

  describe('/credentials (GET)', () => {
    describe('should return 401', () => {
      it('when authorization is missing on headers', async () => {
        const { status } = await server.get('/credentials');
        expect(status).toBe(401);
      });

      it('when token has a invalid signature', async () => {
        const token = faker.lorem.word(15);

        const { status } = await server
          .get('/credentials')
          .set('Authorization', `Bearer ${token}`);
        expect(status).toBe(401);
      });

      it('when token is not bearer token', async () => {
        const token = faker.lorem.word(15);

        const { status } = await server
          .get('/credentials')
          .set('Authorization', `${token}`);
        expect(status).toBe(401);
      });
    });

    describe('should return 200', () => {
      it('with a empty array when user has not credentials yet', async () => {
        const user = await userFactory.create();
        const token = await helpers.generateToken(user);

        const { status, body } = await server
          .get('/credentials')
          .set('Authorization', `Bearer ${token}`);

        expect(status).toBe(200);
        expect(body).toEqual([]);
      });

      it('with user credentials when user exists', async () => {
        const user = await userFactory.create();
        const token = await helpers.generateToken(user);
        const credential = await credentialFactory.create(
          user.id,
          'Credential 1',
        );

        const { status, body } = await server
          .get('/credentials')
          .set('Authorization', `Bearer ${token}`);
        expect(status).toBe(200);
        expect(body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: credential.prisma.id,
              title: credential.prisma.title,
              url: credential.prisma.url,
              username: credential.prisma.username,
              password: credential.passwordDecrypted,
              authorId: credential.prisma.authorId,
            }),
          ]),
        );
      });
    });
  });

  describe('/credentials/:id (GET)', () => {
    describe('should return 401', () => {
      it('when authorization is missing on headers', async () => {
        const { status } = await server.get('/credentials/1');
        expect(status).toBe(401);
      });

      it('when token has a invalid signature', async () => {
        const token = faker.lorem.word(15);

        const { status } = await server
          .get('/credentials/1')
          .set('Authorization', `Bearer ${token}`);
        expect(status).toBe(401);
      });

      it('when token is not bearer token', async () => {
        const token = faker.lorem.word(15);

        const { status } = await server
          .get('/credentials/1')
          .set('Authorization', `${token}`);
        expect(status).toBe(401);
      });
    });

    describe('should return 403', () => {
      it("when user tries to get a credential that doesn't belong to him", async () => {
        const firstUser = await userFactory.create();
        const credential = await credentialFactory.create(
          firstUser.id,
          'Credential 1',
        );

        const secondUser = await userFactory.create();
        const token = await helpers.generateToken(secondUser);

        const { status } = await server
          .get(`/credentials/${credential.prisma.id}`)
          .set('Authorization', `Bearer ${token}`);

        expect(status).toBe(403);
      });
    });

    describe('should return 404', () => {
      it('when user tries to get a credential that do not exist', async () => {
        const user = await userFactory.create();
        const token = await helpers.generateToken(user);

        const { status } = await server
          .get(`/credentials/99999`)
          .set('Authorization', `Bearer ${token}`);

        expect(status).toBe(404);
      });
    });

    describe('should return 200', () => {
      it('with user credentials when credential belongs to him', async () => {
        const user = await userFactory.create();
        const token = await helpers.generateToken(user);

        const credential = await credentialFactory.create(
          user.id,
          'Credential 1',
        );

        const { status, body } = await server
          .get(`/credentials/${credential.prisma.id}`)
          .set('Authorization', `Bearer ${token}`);
        expect(status).toBe(200);
        expect(body).toEqual(
          expect.objectContaining({
            id: credential.prisma.id,
            title: credential.prisma.title,
            url: credential.prisma.url,
            username: credential.prisma.username,
            password: credential.passwordDecrypted,
            authorId: credential.prisma.authorId,
          }),
        );
      });
    });
  });

  describe('/credentials/:id (DELETE)', () => {
    describe('should return 401', () => {
      it('when authorization is missing on headers', async () => {
        const { status } = await server.delete('/credentials/1');
        expect(status).toBe(401);
      });

      it('when token has a invalid signature', async () => {
        const token = faker.lorem.word(15);

        const { status } = await server
          .delete('/credentials/1')
          .set('Authorization', `Bearer ${token}`);
        expect(status).toBe(401);
      });

      it('when token is not bearer token', async () => {
        const token = faker.lorem.word(15);

        const { status } = await server
          .delete('/credentials/1')
          .set('Authorization', `${token}`);
        expect(status).toBe(401);
      });
    });

    describe('should return 403', () => {
      it("when user tries to delete a credential that doesn't belong to him", async () => {
        const firstUser = await userFactory.create();
        const credential = await credentialFactory.create(
          firstUser.id,
          'Credential 1',
        );

        const secondUser = await userFactory.create();
        const token = await helpers.generateToken(secondUser);

        const { status } = await server
          .delete(`/credentials/${credential.prisma.id}`)
          .set('Authorization', `Bearer ${token}`);

        expect(status).toBe(403);
      });
    });

    describe('should return 404', () => {
      it('when user tries to delete a credential that do not exist', async () => {
        const user = await userFactory.create();
        const token = await helpers.generateToken(user);

        const { status } = await server
          .delete(`/credentials/99999`)
          .set('Authorization', `Bearer ${token}`);

        expect(status).toBe(404);
      });
    });

    describe('should return 200', () => {
      it('with user credentials when credential belongs to him', async () => {
        const user = await userFactory.create();
        const token = await helpers.generateToken(user);

        const credential = await credentialFactory.create(
          user.id,
          'Credential 1',
        );

        const { status, body } = await server
          .delete(`/credentials/${credential.prisma.id}`)
          .set('Authorization', `Bearer ${token}`);
        expect(status).toBe(200);
        expect(body).toEqual(
          expect.objectContaining({
            id: credential.prisma.id,
            title: credential.prisma.title,
            url: credential.prisma.url,
            username: credential.prisma.username,
            authorId: credential.prisma.authorId,
          }),
        );
      });
    });
  });
});
