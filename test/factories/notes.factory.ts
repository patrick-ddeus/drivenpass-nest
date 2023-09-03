import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../src/prisma/prisma.service';
import { faker } from '@faker-js/faker';

@Injectable()
export class NotesFactory {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, title: string) {
    const passwordGenerated = faker.internet.password();
    return {
      prisma: await this.prisma.annotation.create({
        data: {
          title,
          description: faker.lorem.word(25),
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
      description: faker.lorem.word(25),
      title: title || faker.lorem.word(15),
    };
  }
}
