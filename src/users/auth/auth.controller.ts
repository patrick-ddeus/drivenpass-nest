import {
  Controller,
  Post,
  Body,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AuthService, JWTPayload } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import {
  ApiBody,
  ApiOperation,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '../../decorators/user.decorator';
import { DeleteDto } from './dto/delete.dto';
import { AuthGuard } from '../../guards/auth.guard';

class SignInResponse {
  @ApiProperty({ name: 'acess_token', example: 'Bearer Token' })
  access_token: string;
}

@ApiTags('Users')
@Controller('users')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-up')
  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Created',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'Returns bad request when password is weak or email is invalid!',
  })
  @ApiBody({
    type: SignUpDto,
  })
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @HttpCode(200)
  @Post('/sign-in')
  @ApiOperation({ summary: 'Auth a user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'OK',
    type: SignInResponse,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "Returns unauthorized when email or password don't exist",
  })
  @ApiBody({
    type: SignUpDto,
  })
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @HttpCode(200)
  @ApiOperation({ summary: 'Delete user account' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'OK',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Returns unauthorized when password is not from user',
  })
  @ApiBody({
    type: DeleteDto,
  })
  @UseGuards(AuthGuard)
  @Delete('/erase')
  erase(@User() user: JWTPayload, @Body() deleteDto: DeleteDto) {
    return this.authService.erase(user, deleteDto);
  }
}
