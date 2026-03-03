import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { LetterService } from './letter.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../entities';
import type { CreateLetterDto, UpdateLetterDto } from '@yuna/shared-types';

@Controller()
@UseGuards(JwtAuthGuard)
export class LetterController {
  constructor(private readonly letterService: LetterService) {}

  @Post('letters')
  create(@CurrentUser() user: User, @Body() dto: CreateLetterDto) {
    return this.letterService.create(user.id, dto);
  }

  @Get('babies/:babyId/letters')
  findByBaby(
    @Param('babyId') babyId: string,
    @CurrentUser() user: User,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.letterService.findByBaby(babyId, user.id, page, limit);
  }

  @Get('letters/:id')
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.letterService.findOne(id, user.id);
  }

  @Patch('letters/:id')
  update(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Body() dto: UpdateLetterDto,
  ) {
    return this.letterService.update(id, user.id, dto);
  }

  @Delete('letters/:id')
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.letterService.remove(id, user.id);
  }
}
