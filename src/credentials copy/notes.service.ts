/* eslint-disable @typescript-eslint/no-var-requires */
import {
  Injectable,
  ConflictException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateNotesDto } from './dto/create-notes.dto';
import { NotesRepository } from './notes.repository';
import { JWTPayload } from '../users/auth/auth.service';
import { exclude } from '../utils/prisma.utils';
import { Annotation } from '@prisma/client';

@Injectable()
export class NotesService {
  constructor(private readonly notesRepository: NotesRepository) {}

  async create(createNotesDto: CreateNotesDto, user: JWTPayload) {
    try {
      const note = await this.notesRepository.create({
        ...createNotesDto,
        Author: {
          connect: {
            id: user.id,
          },
        },
      });

      return exclude(note, 'createdAt', 'updatedAt');
    } catch (error) {
      if (error.code === 'P2002') throw new ConflictException();
    }
  }

  async findOne(id: number, userId: number) {
    const notes = await this.notesRepository.listOne({ id });

    this.validNotes(notes, userId);

    return notes;
  }

  async findAll(id: number) {
    const notes = await this.notesRepository.findAll({
      authorId: id,
    });

    return notes;
  }

  async remove(id: number, userId: number) {
    const note = await this.findOne(id, userId);
    const removedNotes = await this.notesRepository.remove(note.id);
    return exclude(removedNotes, 'updatedAt', 'createdAt', 'description');
  }

  private validNotes(notes: Annotation, userId: number) {
    if (!notes) {
      throw new NotFoundException();
    }

    if (notes.authorId !== userId) {
      throw new ForbiddenException();
    }
  }
}
