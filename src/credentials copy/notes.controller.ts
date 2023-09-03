import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNotesDto } from './dto/create-notes.dto';
import { AuthGuard } from '../guards/auth.guard';
import { User } from '../decorators/user.decorator';
import { JWTPayload } from '../users/auth/auth.service';
import { ApiBody } from '@nestjs/swagger';

@UseGuards(AuthGuard)
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  @ApiBody({
    description: 'Receive title and description to create notes',
  })
  create(@Body() createNotesDto: CreateNotesDto, @User() user: JWTPayload) {
    return this.notesService.create(createNotesDto, user);
  }

  @Get()
  findAll(@User('id') id: number) {
    return this.notesService.findAll(id);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) paramId: string,
    @User('id') userId: number,
  ) {
    return this.notesService.findOne(+paramId, userId);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) paramId: string,
    @User('id') userId: number,
  ) {
    return this.notesService.remove(+paramId, userId);
  }
}
