import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LetterController } from './letter.controller';
import { LetterService } from './letter.service';
import { Letter, BabyMembership, User } from '../common/entities';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [TypeOrmModule.forFeature([Letter, BabyMembership, User]), AuthModule],
    controllers: [LetterController],
    providers: [LetterService],
    exports: [LetterService],
})
export class LetterModule { }
