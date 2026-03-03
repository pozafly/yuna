import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { InvitationService } from './invitation.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../entities';

@Controller()
@UseGuards(JwtAuthGuard)
export class InvitationController {
  constructor(private readonly invitationService: InvitationService) {}

  @Post('invitations')
  create(
    @CurrentUser() user: User,
    @Body('babyId') babyId: string,
    @Body('inviteeEmail') inviteeEmail: string,
  ) {
    return this.invitationService.create(user.id, babyId, inviteeEmail);
  }

  @Get('babies/:babyId/invitations')
  findByBaby(@Param('babyId') babyId: string) {
    return this.invitationService.findByBaby(babyId);
  }

  @Delete('invitations/:id')
  cancel(@Param('id') id: string, @CurrentUser() user: User) {
    return this.invitationService.cancel(id, user.id);
  }

  /** 초대 토큰 검증 (비인증 가능) */
  @Get('invitations/verify')
  async verify(@Query('token') token: string) {
    const invitation = await this.invitationService.findByToken(token);
    return {
      id: invitation.id,
      babyId: invitation.babyId,
      babyName: invitation.baby?.name,
      inviteeEmail: invitation.inviteeEmail,
      status: invitation.status,
      expiresAt: invitation.expiresAt.toISOString(),
    };
  }
}
