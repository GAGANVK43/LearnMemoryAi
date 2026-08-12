import { Module } from '@nestjs/common';
import { StudySessionsController } from './study-sessions.controller';
import { StudySessionsService } from './study-sessions.service';
import { LearningAnalysisModule } from '../learning-analysis/learning-analysis.module';

@Module({
  imports: [LearningAnalysisModule],
  controllers: [StudySessionsController],
  providers: [StudySessionsService],
  exports: [StudySessionsService],
})
export class StudySessionsModule {}
