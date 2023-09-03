import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../src/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { Helpers } from '../utils';

@Injectable()
export class CredentialFactory {
  constructor(
    private readonly prisma: PrismaService,
    private readonly helpers: Helpers,
  ) {}

  async create(userId: number, title: string) {
    const passwordGenerated = faker.internet.password();
    return {
      prisma: await this.prisma.credential.create({
        data: {
          url: faker.internet.url({ protocol: 'http' }),
          username: faker.internet.userName(),
          password: this.helpers.cryptr.encrypt(passwordGenerated),
          title,
          Author: {
            connect: {
              id: userId,
            },
          },
        },
      }),
      passwordDecrypted: passwordGenerated,
    };
  }

  build(title?: string) {
    return {
      url: faker.internet.url({ protocol: 'http' }),
      username: faker.internet.userName(),
      password: faker.internet.password(),
      title: title || faker.lorem.word(15),
    };
  }
}
