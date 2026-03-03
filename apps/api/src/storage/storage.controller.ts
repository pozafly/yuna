import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { StorageService } from './storage.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../entities';

@Controller('storage')
@UseGuards(JwtAuthGuard)
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  /** 업로드용 presigned PUT URL 발급 */
  @Post('presigned-url')
  getPresignedPutUrl(
    @CurrentUser() user: User,
    @Body('babyId') babyId: string,
    @Body('fileName') fileName: string,
  ) {
    return this.storageService.getPresignedPutUrl(user.id, babyId, fileName);
  }

  /** 조회용 presigned GET URL 발급 */
  @Get('presigned-url')
  getPresignedGetUrl(
    @CurrentUser() user: User,
    @Query('babyId') babyId: string,
    @Query('key') key: string,
  ) {
    return this.storageService.getPresignedGetUrl(user.id, babyId, key);
  }
}
