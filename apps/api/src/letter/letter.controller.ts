import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards
} from '@nestjs/common';
import { CreateLetterDto } from '@yuna/shared-types';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AuthGuard } from '../common/guards/auth.guard';
import { RequestUser } from '../common/types/request-user.type';
import { LetterService } from './letter.service';

@Controller('letters')
@UseGuards(AuthGuard)
export class LetterController {
  constructor(private readonly letterService: LetterService) {}

  @Post()
  async create(@CurrentUser() user: RequestUser, @Body() body: CreateLetterDto) {
    return {
      success: true,
      data: await this.letterService.create(user.id, body)
    };
  }

  @Get('baby/:babyId')
  async listByBaby(
    @CurrentUser() user: RequestUser,
    @Param('babyId') babyId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string
  ) {
    return this.letterService.listByBaby(
      user.id,
      babyId,
      page ? Number(page) : 1,
      limit ? Number(limit) : 20
    );
  }

  @Get(':id')
  async getById(@CurrentUser() user: RequestUser, @Param('id') letterId: string) {
    return {
      success: true,
      data: await this.letterService.getById(user.id, letterId)
    };
  }
}
