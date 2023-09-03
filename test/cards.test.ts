import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { Helpers } from './utils';
import { AppModule } from '../src/app.module';
import { UserFactory } from './factories/user.factory';
import { CardsFactory } from './factories/cards.factory';
import { faker } from '@faker-js/faker';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let helpers: Helpers;
  let server: request.SuperTest<request.Test>;
  let userFactory: UserFactory;
  let cardsFactory: CardsFactory;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [Helpers, UserFactory, CardsFactory],
    }).compile();

    helpers = moduleFixture.get<Helpers>(Helpers);
    userFactory = moduleFixture.get<UserFactory>(UserFactory);
    cardsFactory = moduleFixture.get<CardsFactory>(CardsFactory);

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    server = request(app.getHttpServer());
  });

  beforeEach(async () => {
    await helpers.cleanDb();
  });

  describe('/cards (POST)', () => {
    describe('should return 400', () => {
      it('when body is missing', async () => {
        const user = await userFactory.create();
        const token = await helpers.generateToken(user);

        const { status } = await server
          .post('/cards')
          .set('Authorization', `Bearer ${token}`);
        expect(status).toBe(400);
      });

      it('when body is invalid', async () => {
        const user = await userFactory.create();
        const token = await helpers.generateToken(user);

        const { status } = await server
          .post('/cards')
          .send({ url: 'urlinvalida', username: 1234, password: '', title: '' })
          .set('Authorization', `Bearer ${token}`);
        expect(status).toBe(400);
      });

      it('when url is not a url', async () => {
        const user = await userFactory.create();
        const token = await helpers.generateToken(user);

        const { status } = await server
          .post('/cards')
          .send({
            url: 'urlinvalida',
            username: 'uservalido',
            password: 'senhadacardvalida',
            title: '',
          })
          .set('Authorization', `Bearer ${token}`);
        expect(status).toBe(400);
      });

      it('when title is missing', async () => {
        const user = await userFactory.create();
        const token = await helpers.generateToken(user);

        const { status } = await server
          .post('/cards')
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
        const { status } = await server.post('/cards');
        expect(status).toBe(401);
      });

      it('when token has a invalid signature', async () => {
        const token = faker.lorem.word(15);

        const { status } = await server
          .post('/cards')
          .set('Authorization', `Bearer ${token}`);
        expect(status).toBe(401);
      });

      it('when token is not bearer token', async () => {
        const token = faker.lorem.word(15);

        const { status } = await server
          .post('/cards')
          .set('Authorization', `${token}`);
        expect(status).toBe(401);
      });
    });

    describe('should return 409', () => {
      it('when user tries to create a card with same title', async () => {
        const user = await userFactory.create();
        const token = await helpers.generateToken(user);
        const card = await cardsFactory.create(user.id, 'titulo');

        const { status } = await server
          .post('/cards')
          .send(cardsFactory.build(card.prisma.title))
          .set('Authorization', `Bearer ${token}`);

        expect(status).toBe(409);
      });
    });

    describe('should return 201', () => {
      it('when body is valid', async () => {
        const user = await userFactory.create();
        const token = await helpers.generateToken(user);

        const { status } = await server
          .post('/cards')
          .send(cardsFactory.build())
          .set('Authorization', `Bearer ${token}`);
        expect(status).toBe(201);
      });
    });
  });

  describe('/cards (GET)', () => {
    describe('should return 401', () => {
      it('when authorization is missing on headers', async () => {
        const { status } = await server.get('/cards');
        expect(status).toBe(401);
      });

      it('when token has a invalid signature', async () => {
        const token = faker.lorem.word(15);

        const { status } = await server
          .get('/cards')
          .set('Authorization', `Bearer ${token}`);
        expect(status).toBe(401);
      });

      it('when token is not bearer token', async () => {
        const token = faker.lorem.word(15);

        const { status } = await server
          .get('/cards')
          .set('Authorization', `${token}`);
        expect(status).toBe(401);
      });
    });

    describe('should return 200', () => {
      it('with a empty array when user has not cards yet', async () => {
        const user = await userFactory.create();
        const token = await helpers.generateToken(user);

        const { status, body } = await server
          .get('/cards')
          .set('Authorization', `Bearer ${token}`);

        expect(status).toBe(200);
        expect(body).toEqual([]);
      });

      it('with user cards when user exists', async () => {
        const user = await userFactory.create();
        const token = await helpers.generateToken(user);
        const card = await cardsFactory.create(user.id, 'card 1');

        const { status, body } = await server
          .get('/cards')
          .set('Authorization', `Bearer ${token}`);
        expect(status).toBe(200);
        expect(body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: card.prisma.id,
              title: card.prisma.title,
              expirationDate: card.prisma.expirationDate.toISOString(),
              isVirtual: card.prisma.isVirtual,
              name: card.prisma.name,
              number: card.prisma.number,
              password: card.passwordDecrypted,
              secureCode: card.prisma.secureCode,
              type: card.prisma.type,
              authorId: card.prisma.authorId,
            }),
          ]),
        );
      });
    });
  });

  describe('/cards/:id (GET)', () => {
    describe('should return 401', () => {
      it('when authorization is missing on headers', async () => {
        const { status } = await server.get('/cards/1');
        expect(status).toBe(401);
      });

      it('when token has a invalid signature', async () => {
        const token = faker.lorem.word(15);

        const { status } = await server
          .get('/cards/1')
          .set('Authorization', `Bearer ${token}`);
        expect(status).toBe(401);
      });

      it('when token is not bearer token', async () => {
        const token = faker.lorem.word(15);

        const { status } = await server
          .get('/cards/1')
          .set('Authorization', `${token}`);
        expect(status).toBe(401);
      });
    });

    describe('should return 403', () => {
      it("when user tries to get a card that doesn't belong to him", async () => {
        const firstUser = await userFactory.create();
        const card = await cardsFactory.create(firstUser.id, 'card 1');

        const secondUser = await userFactory.create();
        const token = await helpers.generateToken(secondUser);

        const { status } = await server
          .get(`/cards/${card.prisma.id}`)
          .set('Authorization', `Bearer ${token}`);

        expect(status).toBe(403);
      });
    });

    describe('should return 404', () => {
      it('when user tries to get a card that do not exist', async () => {
        const user = await userFactory.create();
        const token = await helpers.generateToken(user);

        const { status } = await server
          .get(`/cards/99999`)
          .set('Authorization', `Bearer ${token}`);

        expect(status).toBe(404);
      });
    });

    describe('should return 200', () => {
      it('with user cards when card belongs to him', async () => {
        const user = await userFactory.create();
        const token = await helpers.generateToken(user);

        const card = await cardsFactory.create(user.id, 'card 1');

        const { status, body } = await server
          .get(`/cards/${card.prisma.id}`)
          .set('Authorization', `Bearer ${token}`);
        expect(status).toBe(200);
        expect(body).toEqual(
          expect.objectContaining({
            id: card.prisma.id,
            title: card.prisma.title,
            expirationDate: card.prisma.expirationDate.toISOString(),
            isVirtual: card.prisma.isVirtual,
            name: card.prisma.name,
            number: card.prisma.number,
            password: card.passwordDecrypted,
            secureCode: card.prisma.secureCode,
            type: card.prisma.type,
            authorId: card.prisma.authorId,
          }),
        );
      });
    });
  });

  describe('/cards/:id (DELETE)', () => {
    describe('should return 401', () => {
      it('when authorization is missing on headers', async () => {
        const { status } = await server.delete('/cards/1');
        expect(status).toBe(401);
      });

      it('when token has a invalid signature', async () => {
        const token = faker.lorem.word(15);

        const { status } = await server
          .delete('/cards/1')
          .set('Authorization', `Bearer ${token}`);
        expect(status).toBe(401);
      });

      it('when token is not bearer token', async () => {
        const token = faker.lorem.word(15);

        const { status } = await server
          .delete('/cards/1')
          .set('Authorization', `${token}`);
        expect(status).toBe(401);
      });
    });

    describe('should return 403', () => {
      it("when user tries to delete a card that doesn't belong to him", async () => {
        const firstUser = await userFactory.create();
        const card = await cardsFactory.create(firstUser.id, 'card 1');

        const secondUser = await userFactory.create();
        const token = await helpers.generateToken(secondUser);

        const { status } = await server
          .delete(`/cards/${card.prisma.id}`)
          .set('Authorization', `Bearer ${token}`);

        expect(status).toBe(403);
      });
    });

    describe('should return 404', () => {
      it('when user tries to delete a card that do not exist', async () => {
        const user = await userFactory.create();
        const token = await helpers.generateToken(user);

        const { status } = await server
          .delete(`/cards/99999`)
          .set('Authorization', `Bearer ${token}`);

        expect(status).toBe(404);
      });
    });

    describe('should return 200', () => {
      it('with user cards when card belongs to him', async () => {
        const user = await userFactory.create();
        const token = await helpers.generateToken(user);

        const card = await cardsFactory.create(user.id, 'card 1');

        const { status, body } = await server
          .delete(`/cards/${card.prisma.id}`)
          .set('Authorization', `Bearer ${token}`);
        expect(status).toBe(200);
        expect(body).toEqual(
          expect.objectContaining({
            id: card.prisma.id,
            title: card.prisma.title,
            expirationDate: card.prisma.expirationDate.toISOString(),
            isVirtual: card.prisma.isVirtual,
            name: card.prisma.name,
            type: card.prisma.type,
            number: card.prisma.number,
            authorId: card.prisma.authorId,
          }),
        );
      });
    });
  });
});
