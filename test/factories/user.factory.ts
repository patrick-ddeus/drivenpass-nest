import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../src/prisma/prisma.service';
import { faker } from '@faker-js/faker';

@Injectable()
export class UserFactory {
  constructor(private readonly prisma: PrismaService) {}

  async create() {
    return await this.prisma.user.create({
      data: {
        email: faker.internet.email(),
        password: faker.internet.password({
          prefix: '!3#p',
        }),
      },
    });
  }
}
