import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../src/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { Helpers } from '../utils';

@Injectable()
export class CardsFactory {
  constructor(
    private readonly prisma: PrismaService,
    private readonly helpers: Helpers,
  ) {}

  async create(userId: number, title: string) {
    const passwordGenerated = faker.internet.password();
    return {
      prisma: await this.prisma.creditCard.create({
        data: {
          title,
          expirationDate: faker.date.future(),
          isVirtual: faker.datatype.boolean(),
          name: faker.finance.creditCardIssuer(),
          number: faker.finance.creditCardNumber(),
          password: this.helpers.cryptr.encrypt(passwordGenerated),
          secureCode: faker.finance.creditCardCVV(),
          type: 'BOTH',
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
      expirationDate: faker.date.future(),
      isVirtual: faker.datatype.boolean(),
      name: faker.finance.creditCardIssuer(),
      number: faker.finance.creditCardNumber(),
      password: faker.internet.password(),
      secureCode: faker.finance.creditCardCVV(),
      type: 'BOTH',
      title: title || faker.lorem.word(15),
    };
  }
}
