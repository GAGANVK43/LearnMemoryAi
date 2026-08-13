import { Module } from '@nestjs/common';
import { QuizController } from './quiz.controller';
import { QuizService } from './quiz.service';
import { PrismaModule } from '../prisma/prisma.module';
import { MemoryRetrievalModule } from '../memory-retrieval/memory-retrieval.module';
import { AIModule } from '../ai/ai.module';

@Module({
  imports: [PrismaModule, MemoryRetrievalModule, AIModule],
  controllers: [QuizController],
  providers: [QuizService],
  exports: [QuizService],
})
export class QuizModule {}
