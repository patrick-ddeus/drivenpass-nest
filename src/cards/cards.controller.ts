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
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { AuthGuard } from '../guards/auth.guard';
import { User } from '../decorators/user.decorator';
import { JWTPayload } from '../users/auth/auth.service';

@UseGuards(AuthGuard)
@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  create(@Body() createCardDto: CreateCardDto, @User() user: JWTPayload) {
    return this.cardsService.create(createCardDto, user);
  }

  @Get()
  findAll(@User('id') id: number) {
    return this.cardsService.findAll(+id);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) paramId: string,
    @User('id') userId: number,
  ) {
    return this.cardsService.findOne(+paramId, userId);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) paramId: string,
    @User('id') userId: number,
  ) {
    return this.cardsService.remove(+paramId, userId);
  }
}
