import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  HttpStatus,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNotesDto } from './dto/create-notes.dto';
import { AuthGuard } from '../guards/auth.guard';
import { User } from '../decorators/user.decorator';
import { JWTPayload } from '../users/auth/auth.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Notes')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  @ApiOperation({ summary: 'Create new notes for provided user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Created',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Conflict when theres a combination of user and title',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request when body is invalid',
  })
  @ApiBody({
    description: 'Receive title and description to create notes',
    type: CreateNotesDto,
  })
  create(@Body() createNotesDto: CreateNotesDto, @User() user: JWTPayload) {
    return this.notesService.create(createNotesDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get notes by userId' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns ok with all notes',
  })
  findAll(@User('id') id: number) {
    return this.notesService.findAll(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one note by userId' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns ok with all notes from user id',
  })
  @ApiParam({ name: 'id', example: 1 })
  findOne(
    @Param('id', ParseIntPipe) paramId: string,
    @User('id') userId: number,
  ) {
    return this.notesService.findOne(+paramId, userId);
  }

  @ApiOperation({ summary: 'delete one note by param id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns OK with deleted note',
  })
  @ApiParam({ name: 'id', example: 1 })
  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) paramId: string,
    @User('id') userId: number,
  ) {
    return this.notesService.remove(+paramId, userId);
  }
}
