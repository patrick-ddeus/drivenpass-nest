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
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
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

@ApiTags('Cards')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  @ApiOperation({ summary: 'Create new cards for provided user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Created',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Conflict when theres a combination of user and description',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request when body is invalid',
  })
  @ApiBody({
    description: 'Receive title and description to create cards',
    type: CreateCardDto,
  })
  create(@Body() createCardDto: CreateCardDto, @User() user: JWTPayload) {
    return this.cardsService.create(createCardDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get cards by userId' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns ok with all cards',
  })
  findAll(@User('id') id: number) {
    return this.cardsService.findAll(+id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one card by userId' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns ok with all cards from user id',
  })
  @ApiParam({ name: 'id', example: 1 })
  findOne(
    @Param('id', ParseIntPipe) paramId: string,
    @User('id') userId: number,
  ) {
    return this.cardsService.findOne(+paramId, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'delete one card by param id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns OK with deleted card',
  })
  @ApiParam({ name: 'id', example: 1 })
  remove(
    @Param('id', ParseIntPipe) paramId: string,
    @User('id') userId: number,
  ) {
    return this.cardsService.remove(+paramId, userId);
  }
}
