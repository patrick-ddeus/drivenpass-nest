/* eslint-disable @typescript-eslint/no-var-requires */
import {
  Injectable,
  ConflictException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { CardsRepository } from './cards.repository';
import { JWTPayload } from '../users/auth/auth.service';
import { exclude } from '../utils/prisma.utils';
import Cryptr from 'cryptr';
import { CreditCard } from '@prisma/client';

@Injectable()
export class CardsService {
  private cryptr: Cryptr;

  constructor(private readonly cardsRepository: CardsRepository) {
    const Cryptr = require('cryptr');
    this.cryptr = new Cryptr(process.env.SECRET);
  }

  async create(createCardDto: CreateCardDto, user: JWTPayload) {
    try {
      const card = await this.cardsRepository.create({
        ...createCardDto,
        password: this.cryptr.encrypt(createCardDto.password),
        expirationDate: new Date(createCardDto.expirationDate),
        Author: {
          connect: {
            id: user.id,
          },
        },
      });

      return exclude(card, 'createdAt', 'updatedAt', 'password');
    } catch (error) {
      if (error.code === 'P2002') throw new ConflictException();
      console.log(error);
    }
  }

  async findOne(id: number, userId: number) {
    const cards = await this.cardsRepository.listOne({ id });

    this.validCards(cards, userId);

    return {
      ...cards,
      password: this.cryptr.decrypt(cards.password),
    };
  }

  async findAll(id: number) {
    const cards = await this.cardsRepository.findAll({
      authorId: id,
    });

    if (cards.length === 0) return cards;

    const decryptedCards = cards.map((card) => ({
      ...card,
      password: this.cryptr.decrypt(card.password),
    }));

    return decryptedCards;
  }

  async remove(id: number, userId: number) {
    const card = await this.findOne(id, userId);
    const deletedCart = await this.cardsRepository.remove(card.id);
    return exclude(
      deletedCart,
      'password',
      'secureCode',
      'createdAt',
      'updatedAt',
    );
  }

  private validCards(cards: CreditCard, userId: number) {
    if (!cards) {
      throw new NotFoundException();
    }

    if (cards.authorId !== userId) {
      throw new ForbiddenException();
    }
  }
}
