import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { LetterController } from './letter.controller';
import { LetterService } from './letter.service';

@Module({
  imports: [CommonModule],
  controllers: [LetterController],
  providers: [LetterService],
  exports: [LetterService]
})
export class LetterModule {}
