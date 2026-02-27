import { Controller, Post, Get, Body, Param, Query, UseGuards, Put } from '@nestjs/common';
import { LetterService } from './letter.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../common/entities';

@Controller('letters')
@UseGuards(AuthGuard)
export class LetterController {
    constructor(private readonly letterService: LetterService) { }

    @Post()
    async create(@CurrentUser() user: User, @Body() body: { babyId: string; title: string; content: string; visibility: string }) {
        const letter = await this.letterService.create(user.id, body);
        return { success: true, data: letter };
    }

    @Get('baby/:babyId')
    async findAll(@Param('babyId') babyId: string, @CurrentUser() user: User, @Query('page') page?: string, @Query('limit') limit?: string) {
        const data = await this.letterService.findAll(babyId, user.id, Number(page || 1), Number(limit || 20));
        return { success: true, data: data.letters, total: data.total };
    }

    @Get(':id')
    async findOne(@Param('id') id: string, @CurrentUser() user: User) {
        const letter = await this.letterService.findOne(id, user.id);
        return { success: true, data: letter };
    }
}
