import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AuthGuard } from '../common/guards/auth.guard';
import { RequestUser } from '../common/types/request-user.type';
import { NotificationService } from './notification.service';

@Controller('notifications')
@UseGuards(AuthGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  async list(
    @CurrentUser() user: RequestUser,
    @Query('page') page?: string,
    @Query('limit') limit?: string
  ) {
    return this.notificationService.listForUser(
      user.id,
      page ? Number(page) : 1,
      limit ? Number(limit) : 20
    );
  }
}
