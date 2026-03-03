import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LetterController } from './letter.controller';
import { LetterService } from './letter.service';
import { Letter, BabyMembership, Baby } from '../entities';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Letter, BabyMembership, Baby]),
    AuthModule,
  ],
  controllers: [LetterController],
  providers: [LetterService],
})
export class LetterModule {}
