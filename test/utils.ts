import { Injectable } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';

@Injectable()
export class Helpers {
  constructor(private readonly prisma: PrismaService) {}

  async cleanDb() {
    await this.prisma.user.deleteMany();
  }
}
