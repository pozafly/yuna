import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateInvitationDto } from '@yuna/shared-types';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AuthGuard } from '../common/guards/auth.guard';
import { RequestUser } from '../common/types/request-user.type';
import { InvitationService } from './invitation.service';

@Controller('invitations')
@UseGuards(AuthGuard)
export class InvitationController {
  constructor(private readonly invitationService: InvitationService) {}

  @Post()
  async create(@CurrentUser() user: RequestUser, @Body() body: CreateInvitationDto) {
    return {
      success: true,
      data: await this.invitationService.create(user.id, body),
      message: '개발 모드에서는 응답에 초대 토큰이 포함됩니다.'
    };
  }
}
