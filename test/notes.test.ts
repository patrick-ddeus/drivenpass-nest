import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { Helpers } from './utils';
import { AppModule } from '../src/app.module';
import { UserFactory } from './factories/user.factory';
import { NotesFactory } from './factories/notes.factory';
import { faker } from '@faker-js/faker';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let helpers: Helpers;
  let server: request.SuperTest<request.Test>;
  let userFactory: UserFactory;
  let notesFactory: NotesFactory;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [Helpers, UserFactory, NotesFactory],
    }).compile();

    helpers = moduleFixture.get<Helpers>(Helpers);
    userFactory = moduleFixture.get<UserFactory>(UserFactory);
    notesFactory = moduleFixture.get<NotesFactory>(NotesFactory);

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    server = request(app.getHttpServer());
  });

  beforeEach(async () => {
    await helpers.cleanDb();
  });

  describe('/notes (POST)', () => {
    describe('should return 400', () => {
      it('when body is missing', async () => {
        const user = await userFactory.create();
        const token = await helpers.generateToken(user);

        const { status } = await server
          .post('/notes')
          .set('Authorization', `Bearer ${token}`);
        expect(status).toBe(400);
      });

      it('when body is invalid', async () => {
        const user = await userFactory.create();
        const token = await helpers.generateToken(user);

        const { status } = await server
          .post('/notes')
          .send({ url: 'urlinvalida', username: 1234, password: '', title: '' })
          .set('Authorization', `Bearer ${token}`);
        expect(status).toBe(400);
      });

      it('when url is not a url', async () => {
        const user = await userFactory.create();
        const token = await helpers.generateToken(user);

        const { status } = await server
          .post('/notes')
          .send({
            url: 'urlinvalida',
            username: 'uservalido',
            password: 'senhadanotevalida',
            title: '',
          })
          .set('Authorization', `Bearer ${token}`);
        expect(status).toBe(400);
      });

      it('when title is missing', async () => {
        const user = await userFactory.create();
        const token = await helpers.generateToken(user);

        const { status } = await server
          .post('/notes')
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
        const { status } = await server.post('/notes');
        expect(status).toBe(401);
      });

      it('when token has a invalid signature', async () => {
        const token = faker.lorem.word(15);

        const { status } = await server
          .post('/notes')
          .set('Authorization', `Bearer ${token}`);
        expect(status).toBe(401);
      });

      it('when token is not bearer token', async () => {
        const token = faker.lorem.word(15);

        const { status } = await server
          .post('/notes')
          .set('Authorization', `${token}`);
        expect(status).toBe(401);
      });
    });

    describe('should return 409', () => {
      it('when user tries to create a note with same title', async () => {
        const user = await userFactory.create();
        const token = await helpers.generateToken(user);
        const note = await notesFactory.create(user.id, 'titulo');

        const { status } = await server
          .post('/notes')
          .send(notesFactory.build(note.prisma.title))
          .set('Authorization', `Bearer ${token}`);

        expect(status).toBe(409);
      });
    });

    describe('should return 201', () => {
      it('when body is valid', async () => {
        const user = await userFactory.create();
        const token = await helpers.generateToken(user);

        const { status } = await server
          .post('/notes')
          .send(notesFactory.build())
          .set('Authorization', `Bearer ${token}`);
        expect(status).toBe(201);
      });
    });
  });

  describe('/notes (GET)', () => {
    describe('should return 401', () => {
      it('when authorization is missing on headers', async () => {
        const { status } = await server.get('/notes');
        expect(status).toBe(401);
      });

      it('when token has a invalid signature', async () => {
        const token = faker.lorem.word(15);

        const { status } = await server
          .get('/notes')
          .set('Authorization', `Bearer ${token}`);
        expect(status).toBe(401);
      });

      it('when token is not bearer token', async () => {
        const token = faker.lorem.word(15);

        const { status } = await server
          .get('/notes')
          .set('Authorization', `${token}`);
        expect(status).toBe(401);
      });
    });

    describe('should return 200', () => {
      it('with a empty array when user has not notes yet', async () => {
        const user = await userFactory.create();
        const token = await helpers.generateToken(user);

        const { status, body } = await server
          .get('/notes')
          .set('Authorization', `Bearer ${token}`);

        expect(status).toBe(200);
        expect(body).toEqual([]);
      });

      it('with user notes when user exists', async () => {
        const user = await userFactory.create();
        const token = await helpers.generateToken(user);
        const note = await notesFactory.create(user.id, 'note 1');

        const { status, body } = await server
          .get('/notes')
          .set('Authorization', `Bearer ${token}`);
        expect(status).toBe(200);
        expect(body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: note.prisma.id,
              title: note.prisma.title,
              description: note.prisma.description,
              authorId: note.prisma.authorId,
            }),
          ]),
        );
      });
    });
  });

  describe('/notes/:id (GET)', () => {
    describe('should return 401', () => {
      it('when authorization is missing on headers', async () => {
        const { status } = await server.get('/notes/1');
        expect(status).toBe(401);
      });

      it('when token has a invalid signature', async () => {
        const token = faker.lorem.word(15);

        const { status } = await server
          .get('/notes/1')
          .set('Authorization', `Bearer ${token}`);
        expect(status).toBe(401);
      });

      it('when token is not bearer token', async () => {
        const token = faker.lorem.word(15);

        const { status } = await server
          .get('/notes/1')
          .set('Authorization', `${token}`);
        expect(status).toBe(401);
      });
    });

    describe('should return 403', () => {
      it("when user tries to get a note that doesn't belong to him", async () => {
        const firstUser = await userFactory.create();
        const note = await notesFactory.create(firstUser.id, 'note 1');

        const secondUser = await userFactory.create();
        const token = await helpers.generateToken(secondUser);

        const { status } = await server
          .get(`/notes/${note.prisma.id}`)
          .set('Authorization', `Bearer ${token}`);

        expect(status).toBe(403);
      });
    });

    describe('should return 404', () => {
      it('when user tries to get a note that do not exist', async () => {
        const user = await userFactory.create();
        const token = await helpers.generateToken(user);

        const { status } = await server
          .get(`/notes/99999`)
          .set('Authorization', `Bearer ${token}`);

        expect(status).toBe(404);
      });
    });

    describe('should return 200', () => {
      it('with user notes when note belongs to him', async () => {
        const user = await userFactory.create();
        const token = await helpers.generateToken(user);

        const note = await notesFactory.create(user.id, 'note 1');

        const { status, body } = await server
          .get(`/notes/${note.prisma.id}`)
          .set('Authorization', `Bearer ${token}`);
        expect(status).toBe(200);
        expect(body).toEqual(
          expect.objectContaining({
            id: note.prisma.id,
            title: note.prisma.title,
            description: note.prisma.description,
            authorId: note.prisma.authorId,
          }),
        );
      });
    });
  });

  describe('/notes/:id (DELETE)', () => {
    describe('should return 401', () => {
      it('when authorization is missing on headers', async () => {
        const { status } = await server.delete('/notes/1');
        expect(status).toBe(401);
      });

      it('when token has a invalid signature', async () => {
        const token = faker.lorem.word(15);

        const { status } = await server
          .delete('/notes/1')
          .set('Authorization', `Bearer ${token}`);
        expect(status).toBe(401);
      });

      it('when token is not bearer token', async () => {
        const token = faker.lorem.word(15);

        const { status } = await server
          .delete('/notes/1')
          .set('Authorization', `${token}`);
        expect(status).toBe(401);
      });
    });

    describe('should return 403', () => {
      it("when user tries to delete a note that doesn't belong to him", async () => {
        const firstUser = await userFactory.create();
        const note = await notesFactory.create(firstUser.id, 'note 1');

        const secondUser = await userFactory.create();
        const token = await helpers.generateToken(secondUser);

        const { status } = await server
          .delete(`/notes/${note.prisma.id}`)
          .set('Authorization', `Bearer ${token}`);

        expect(status).toBe(403);
      });
    });

    describe('should return 404', () => {
      it('when user tries to delete a note that do not exist', async () => {
        const user = await userFactory.create();
        const token = await helpers.generateToken(user);

        const { status } = await server
          .delete(`/notes/99999`)
          .set('Authorization', `Bearer ${token}`);

        expect(status).toBe(404);
      });
    });

    describe('should return 200', () => {
      it('with user notes when note belongs to him', async () => {
        const user = await userFactory.create();
        const token = await helpers.generateToken(user);

        const note = await notesFactory.create(user.id, 'note 1');

        const { status, body } = await server
          .delete(`/notes/${note.prisma.id}`)
          .set('Authorization', `Bearer ${token}`);
        expect(status).toBe(200);
        expect(body).toEqual(
          expect.objectContaining({
            id: note.prisma.id,
            title: note.prisma.title,
            authorId: note.prisma.authorId,
          }),
        );
      });
    });
  });
});
