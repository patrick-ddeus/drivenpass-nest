import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class NotesRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.AnnotationCreateInput) {
    return this.prisma.annotation.create({
      data,
    });
  }

  findAll(where: Prisma.AnnotationWhereInput) {
    return this.prisma.annotation.findMany({
      where,
    });
  }

  listOne(where: Prisma.AnnotationWhereInput) {
    return this.prisma.annotation.findFirst({
      where,
    });
  }

  remove(id: number) {
    return this.prisma.annotation.delete({
      where: {
        id,
      },
    });
  }
}
