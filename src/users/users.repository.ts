import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  list(where: Prisma.UserWhereInput = {}) {
    return this.prisma.user.findMany({ where });
  }

  listOne(where: Prisma.UserWhereInput) {
    return this.prisma.user.findFirst({
      where,
    });
  }

  create(data: Prisma.UserCreateInput) {
    return this.prisma.user.create({
      data,
    });
  }
}
