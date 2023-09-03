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
import { CredentialsService } from './credentials.service';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { AuthGuard } from '../guards/auth.guard';
import { User } from '../decorators/user.decorator';
import { JWTPayload } from '../users/auth/auth.service';
import { ApiBody, ApiHeader } from '@nestjs/swagger';

@UseGuards(AuthGuard)
@Controller('credentials')
export class CredentialsController {
  constructor(private readonly credentialsService: CredentialsService) {}

  @Post()
  @ApiBody({
    description: 'Receive title, username, description and password',
    type: CreateCredentialDto,
  })
  @ApiHeader({
    name: 'Application',
    description: 'Bearer ',
  })
  create(
    @Body() createCredentialDto: CreateCredentialDto,
    @User() user: JWTPayload,
  ) {
    return this.credentialsService.create(createCredentialDto, user);
  }

  @Get()
  findAll(@User('id') id: number) {
    return this.credentialsService.findAll(id);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) paramId: string,
    @User('id') userId: number,
  ) {
    return this.credentialsService.findOne(+paramId, userId);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) paramId: string,
    @User('id') userId: number,
  ) {
    return this.credentialsService.remove(+paramId, userId);
  }
}
