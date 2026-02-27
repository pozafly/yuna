/**
 * Baby 모듈 — Baby CRUD + BabyMembership 관리
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BabyController } from './baby.controller';
import { BabyService } from './baby.service';
import { Baby, BabyMembership, User } from '../common/entities';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Baby, BabyMembership, User]),
        AuthModule,
    ],
    controllers: [BabyController],
    providers: [BabyService],
    exports: [BabyService],
})
export class BabyModule { }
