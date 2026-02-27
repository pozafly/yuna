import { Controller, Post, Get, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { InvitationService } from './invitation.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../common/entities';

@Controller('invitations')
@UseGuards(AuthGuard)
export class InvitationController {
    constructor(private readonly invitationService: InvitationService) { }

    @Post()
    async create(@CurrentUser() user: User, @Body() body: { babyId: string; inviteeEmail: string; role: string }) {
        const invitation = await this.invitationService.create(user.id, body);
        return { success: true, data: invitation };
    }

    @Get('baby/:babyId')
    async findAllByBaby(@Param('babyId') babyId: string) {
        const invitations = await this.invitationService.findAllByBaby(babyId);
        return { success: true, data: invitations };
    }

    @Delete(':id')
    async cancel(@Param('id') id: string, @CurrentUser() user: User) {
        await this.invitationService.cancel(id, user.id);
        return { success: true, message: '초대가 취소되었습니다.' };
    }
}
