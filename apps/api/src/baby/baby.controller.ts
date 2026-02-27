import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards
} from '@nestjs/common';
import { CreateBabyDto } from '@yuna/shared-types';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AuthGuard } from '../common/guards/auth.guard';
import { RequestUser } from '../common/types/request-user.type';
import { BabyService } from './baby.service';

@Controller('babies')
@UseGuards(AuthGuard)
export class BabyController {
  constructor(private readonly babyService: BabyService) {}

  @Post()
  async create(@CurrentUser() user: RequestUser, @Body() body: CreateBabyDto) {
    return {
      success: true,
      data: await this.babyService.create(user.id, body)
    };
  }

  @Get()
  async list(@CurrentUser() user: RequestUser) {
    return {
      success: true,
      data: await this.babyService.listForUser(user.id)
    };
  }

  @Delete(':id')
  async remove(@CurrentUser() user: RequestUser, @Param('id') babyId: string) {
    return {
      success: true,
      data: await this.babyService.remove(user.id, babyId),
      message: '삭제 후 30일 동안 데이터 다운로드가 가능합니다.'
    };
  }
}
