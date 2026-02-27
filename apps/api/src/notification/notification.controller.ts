import { Controller, Get, Put, Param, Query, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../common/entities';

@Controller('notifications')
@UseGuards(AuthGuard)
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) { }

    @Get()
    async findAll(@CurrentUser() user: User, @Query('page') page?: string, @Query('limit') limit?: string) {
        const data = await this.notificationService.findAllByUser(user.id, Number(page || 1), Number(limit || 20));
        return { success: true, data: data.notifications, total: data.total };
    }

    @Put('read/all')
    async markAllAsRead(@CurrentUser() user: User) {
        await this.notificationService.markAllAsRead(user.id);
        return { success: true, message: '모든 알림을 읽음 처리했습니다.' };
    }

    @Put(':id/read')
    async markAsRead(@Param('id') id: string, @CurrentUser() user: User) {
        await this.notificationService.markAsRead(id, user.id);
        return { success: true, message: '알림을 읽음 처리했습니다.' };
    }
}
