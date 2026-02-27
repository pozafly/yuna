import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { InvitationController } from './invitation.controller';
import { InvitationService } from './invitation.service';

@Module({
  imports: [CommonModule],
  controllers: [InvitationController],
  providers: [InvitationService],
  exports: [InvitationService]
})
export class InvitationModule {}
