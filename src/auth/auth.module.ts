import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.SECRET,
      global: true,
      signOptions: {
        expiresIn: '4000',
      },
    }),
  ],
  providers: [],
})
export class AuthModule {}
