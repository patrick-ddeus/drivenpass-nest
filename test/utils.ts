/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import Cryptr from 'cryptr';

@Injectable()
export class Helpers {
  cryptr: Cryptr;
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {
    const Cryptr = require('cryptr');
    this.cryptr = new Cryptr(process.env.SECRET);
  }

  async cleanDb() {
    await this.prisma.user.deleteMany();
  }

  async generateToken(user: Omit<User, 'createdAt' | 'updatedAt'>) {
    return this.jwt.sign(user, { issuer: 'Driven' });
  }
}
