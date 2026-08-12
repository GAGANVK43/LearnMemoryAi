import { Module } from '@nestjs/common';
import { LearningAnalysisService } from './learning-analysis.service';

@Module({
  providers: [LearningAnalysisService],
  exports: [LearningAnalysisService],
})
export class LearningAnalysisModule {}
