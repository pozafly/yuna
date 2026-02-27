import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AuthGuard } from '../common/guards/auth.guard';
import { RequestUser } from '../common/types/request-user.type';
import { StorageService } from './storage.service';

interface PresignedGetRequest {
  babyId: string;
  objectKey: string;
}

interface PresignedPutRequest {
  babyId: string;
  postId: string;
  extension?: string;
}

@Controller('storage')
@UseGuards(AuthGuard)
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('presigned-get')
  async issuePresignedGet(
    @CurrentUser() user: RequestUser,
    @Body() body: PresignedGetRequest
  ) {
    return {
      success: true,
      data: await this.storageService.issuePresignedGet(
        user.id,
        body.babyId,
        body.objectKey
      )
    };
  }

  @Post('presigned-put')
  async issuePresignedPut(
    @CurrentUser() user: RequestUser,
    @Body() body: PresignedPutRequest
  ) {
    return {
      success: true,
      data: await this.storageService.issuePresignedPut(
        user.id,
        body.babyId,
        body.postId,
        body.extension
      )
    };
  }
}
