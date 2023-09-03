import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CardsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.CreditCardCreateInput) {
    return this.prisma.creditCard.create({
      data,
    });
  }

  findAll(where: Prisma.CreditCardWhereInput) {
    return this.prisma.creditCard.findMany({
      where,
    });
  }

  listOne(where: Prisma.CreditCardWhereInput) {
    return this.prisma.creditCard.findFirst({
      where,
    });
  }

  remove(id: number) {
    return this.prisma.creditCard.delete({
      where: {
        id,
      },
    });
  }
}
