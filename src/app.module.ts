import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './users/auth/auth.module';
import { CredentialsModule } from './credentials/credentials.module';

@Module({
  imports: [AuthModule, PrismaModule, CredentialsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
