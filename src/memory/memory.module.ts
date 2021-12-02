import { Module } from '@nestjs/common';
import { MemoryService } from './memory.service';

@Module({
  imports: [MemoryModule],
  providers: [MemoryService],
  exports: [MemoryService],
})
export class MemoryModule {}
