import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { BabyController } from './baby.controller';
import { BabyService } from './baby.service';

@Module({
  imports: [CommonModule],
  controllers: [BabyController],
  providers: [BabyService],
  exports: [BabyService]
})
export class BabyModule {}
