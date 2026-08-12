import { Module } from '@nestjs/common';
import { MemoryRetrievalService } from './memory-retrieval.service';

@Module({
  providers: [MemoryRetrievalService],
  exports: [MemoryRetrievalService],
})
export class MemoryRetrievalModule {}
