/**
 * Baby 컨트롤러 — Baby CRUD API
 */
import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { BabyService } from './baby.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../common/entities';

@Controller('babies')
@UseGuards(AuthGuard)
export class BabyController {
    constructor(private readonly babyService: BabyService) { }

    /** Baby 생성 (온보딩) */
    @Post()
    async create(@CurrentUser() user: User, @Body() body: { name: string; gender: string; birthDate?: string }) {
        const baby = await this.babyService.create(user.id, body);
        return { success: true, data: baby };
    }

    /** 내 Baby 목록 조회 */
    @Get()
    async findAll(@CurrentUser() user: User) {
        const babies = await this.babyService.findAllByUser(user.id);
        return { success: true, data: babies };
    }

    /** Baby 상세 조회 */
    @Get(':id')
    async findOne(@Param('id') id: string, @CurrentUser() user: User) {
        const { baby } = await this.babyService.findOneWithAuth(id, user.id);
        return { success: true, data: baby };
    }

    /** Baby 수정 (OWNER만) */
    @Put(':id')
    async update(@Param('id') id: string, @CurrentUser() user: User, @Body() body: { name?: string; gender?: string }) {
        const baby = await this.babyService.update(id, user.id, body);
        return { success: true, data: baby };
    }

    /** Baby 삭제 (OWNER만) */
    @Delete(':id')
    async remove(@Param('id') id: string, @CurrentUser() user: User) {
        await this.babyService.remove(id, user.id);
        return { success: true, message: 'Baby가 삭제되었습니다. 30일간 데이터 다운로드가 가능합니다.' };
    }
}
