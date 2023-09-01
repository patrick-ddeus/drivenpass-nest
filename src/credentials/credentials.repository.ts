import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CredentialsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.CredentialCreateInput) {
    return this.prisma.credential.create({
      data,
    });
  }

  findAll(where: Prisma.CredentialWhereInput) {
    return this.prisma.credential.findMany({
      where,
    });
  }

  listOne(where: Prisma.CredentialWhereInput) {
    return this.prisma.credential.findFirst({
      where,
    });
  }

  remove(id: number) {
    return this.prisma.credential.delete({
      where: {
        id,
      },
    });
  }
}
