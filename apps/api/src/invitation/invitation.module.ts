import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvitationController } from './invitation.controller';
import { InvitationService } from './invitation.service';
import { Invitation, BabyMembership, User } from '../common/entities';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [TypeOrmModule.forFeature([Invitation, BabyMembership, User]), AuthModule],
    controllers: [InvitationController],
    providers: [InvitationService],
    exports: [InvitationService],
})
export class InvitationModule { }
