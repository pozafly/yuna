import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { BabyService } from './baby.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../entities';
import type { CreateBabyDto, UpdateBabyDto } from '@yuna/shared-types';

@Controller('babies')
@UseGuards(JwtAuthGuard)
export class BabyController {
  constructor(private readonly babyService: BabyService) {}

  @Post()
  create(@CurrentUser() user: User, @Body() dto: CreateBabyDto) {
    return this.babyService.create(user.id, dto);
  }

  @Get()
  findMyBabies(@CurrentUser() user: User) {
    return this.babyService.findMyBabies(user.id);
  }

  @Get(':babyId')
  findOne(@Param('babyId') babyId: string) {
    return this.babyService.findOne(babyId);
  }

  @Patch(':babyId')
  update(
    @Param('babyId') babyId: string,
    @CurrentUser() user: User,
    @Body() dto: UpdateBabyDto,
  ) {
    return this.babyService.update(babyId, user.id, dto);
  }

  @Delete(':babyId')
  remove(@Param('babyId') babyId: string, @CurrentUser() user: User) {
    return this.babyService.remove(babyId, user.id);
  }

  @Get(':babyId/members')
  getMembers(@Param('babyId') babyId: string) {
    return this.babyService.getMembers(babyId);
  }
}
