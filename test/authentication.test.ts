import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { Helpers } from './utils';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let helpers: Helpers;
  let server: request.SuperTest<request.Test>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [Helpers],
    }).compile();

    helpers = moduleFixture.get<Helpers>(Helpers);
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    server = request(app.getHttpServer());
  });

  beforeEach(async () => {
    await helpers.cleanDb();
  });

  describe('/users/sign-up (POST)', () => {
    it('shoul return 400 when body is invalid', async () => {
      const { status } = await server.post('/users/sign-up');
      expect(status).toBe(400);
    });
  });
});
