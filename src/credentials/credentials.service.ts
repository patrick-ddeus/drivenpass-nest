/* eslint-disable @typescript-eslint/no-var-requires */
import {
  Injectable,
  ConflictException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { CredentialsRepository } from './credentials.repository';
import { JWTPayload } from '../users/auth/auth.service';
import { exclude } from '../utils/prisma.utils';
import Cryptr from 'cryptr';
import { Credential } from '@prisma/client';

@Injectable()
export class CredentialsService {
  private cryptr: Cryptr;

  constructor(private readonly credentialsRepository: CredentialsRepository) {
    const Cryptr = require('cryptr');
    this.cryptr = new Cryptr(process.env.SECRET);
  }

  async create(createCredentialDto: CreateCredentialDto, user: JWTPayload) {
    try {
      const credential = await this.credentialsRepository.create({
        ...createCredentialDto,
        password: this.cryptr.encrypt(createCredentialDto.password),
        Author: {
          connect: {
            id: user.id,
          },
        },
      });

      return exclude(credential, 'createdAt', 'updatedAt', 'password');
    } catch (error) {
      if (error.code === 'P2002') throw new ConflictException();
    }
  }

  async findOne(id: number, userId: number) {
    const credentials = await this.credentialsRepository.listOne({ id });

    this.validCredentials(credentials, userId);

    return {
      ...credentials,
      password: this.cryptr.decrypt(credentials.password),
    };
  }

  async findAll(id: number) {
    const credentials = await this.credentialsRepository.findAll({
      authorId: id,
    });

    if (credentials.length === 0) return credentials;

    const decryptedCredentials = credentials.map((credential) => ({
      ...credential,
      password: this.cryptr.decrypt(credential.password),
    }));

    return decryptedCredentials;
  }

  async remove(id: number, userId: number) {
    const credential = await this.findOne(id, userId);
    return this.credentialsRepository.remove(credential.id);
  }

  private validCredentials(credentials: Credential, userId: number) {
    if (!credentials) {
      throw new NotFoundException();
    }

    if (credentials.authorId !== userId) {
      throw new ForbiddenException();
    }
  }
}
