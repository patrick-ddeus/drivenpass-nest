import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
import { UsersService } from '../users.service';
import { SignInDto } from './dto/signin.dto';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { exclude } from '../../utils/prisma.utils';

@Injectable()
export class AuthService {
  private ISSUER: string;

  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {
    this.ISSUER = 'Driven';
  }

  async signUp(signUpDto: SignUpDto) {
    const createdAcc = await this.userService.create(signUpDto);
    return exclude(createdAcc, 'password');
  }

  async signIn(signInDto: SignInDto) {
    const { email, password } = signInDto;

    const user = await this.userService.findByEmail(email);

    if (!user) throw new UnauthorizedException();

    const passwordIsValid = await bcrypt.compare(password, user.password);

    if (!passwordIsValid) throw new UnauthorizedException();

    return this.generateToken({ email: user.email, id: user.id });
  }

  private generateToken(payload: JWTPayload) {
    return {
      access_token: this.jwtService.sign(payload, {
        issuer: this.ISSUER,
      }),
    };
  }

  async validateToken(token: string) {
    return await this.jwtService.verifyAsync<JWTPayload>(token, {
      issuer: this.ISSUER,
    });
  }
}

export type JWTPayload = Pick<User, 'email' | 'id'>;
