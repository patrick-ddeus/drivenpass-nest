import { Controller, Post } from '@nestjs/common';
import { IsStrongPassword, IsUrl, isURL } from "class-validator";

@Controller('auth')
export class AuthController {
  @Post('sign-in')
  signIn()
}
@IsUrl()