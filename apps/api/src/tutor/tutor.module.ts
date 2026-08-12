import { Module } from '@nestjs/common';
import { TutorController } from './tutor.controller';
import { TutorService } from './tutor.service';
import { MemoryRetrievalModule } from '../memory-retrieval/memory-retrieval.module';

@Module({
  imports: [MemoryRetrievalModule],
  controllers: [TutorController],
  providers: [TutorService],
  exports: [TutorService],
})
export class TutorModule {}
