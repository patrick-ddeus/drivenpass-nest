import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './users/auth/auth.module';
import { CredentialsModule } from './credentials/credentials.module';
import { CardsModule } from './cards/cards.module';
import { NotesModule } from './credentials copy/notes.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    CredentialsModule,
    CardsModule,
    NotesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
