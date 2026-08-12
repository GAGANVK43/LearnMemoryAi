import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AIModule } from './ai/ai.module';
import { LearningAnalysisModule } from './learning-analysis/learning-analysis.module';
import { MemoryRetrievalModule } from './memory-retrieval/memory-retrieval.module';
import { StudySessionsModule } from './study-sessions/study-sessions.module';
import { MemoryModule } from './memory/memory.module';
import { TutorModule } from './tutor/tutor.module';
import { StatsModule } from './stats/stats.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../../.env'],
    }),
    PrismaModule,
    AuthModule,
    AIModule,
    LearningAnalysisModule,
    MemoryRetrievalModule,
    StudySessionsModule,
    MemoryModule,
    TutorModule,
    StatsModule,
  ],
})
export class AppModule {}
