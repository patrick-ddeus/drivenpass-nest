import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../src/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';

@Injectable()
export class UserFactory {
  private SALT = bcrypt.genSaltSync(10);
  constructor(private readonly prisma: PrismaService) {}

  async create(params?: Partial<User>) {
    const password = params?.password;
    const hashedPassword = await bcrypt.hash(
      password || faker.internet.password(),
      this.SALT,
    );
    return await this.prisma.user.create({
      data: {
        email: faker.internet.email(),
        password: hashedPassword,
      },
    });
  }

  async getAllRecordsFromUser(userId: number) {
    const credentials = await this.prisma.credential.count({
      where: {
        authorId: userId,
      },
    });

    const cards = await this.prisma.creditCard.count({
      where: {
        authorId: userId,
      },
    });

    const notes = await this.prisma.annotation.count({
      where: {
        authorId: userId,
      },
    });

    return { credentials, cards, notes };
  }
}
