import { Module } from '@nestjs/common';
import { MemoryController } from './memory.controller';
import { MemoryService } from './memory.service';
import { MemoryRetrievalModule } from '../memory-retrieval/memory-retrieval.module';

@Module({
  imports: [MemoryRetrievalModule],
  controllers: [MemoryController],
  providers: [MemoryService],
  exports: [MemoryService],
})
export class MemoryModule {}
