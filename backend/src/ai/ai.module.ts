import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AIService } from './ai.service';
import { AIController } from './ai.controller';
import { GeminiProvider } from './providers/gemini.provider';
import { LocalAIProvider } from './providers/local.provider';
import { MockAIProvider } from './providers/mock.provider';

@Global()
@Module({
  imports: [ConfigModule],
  controllers: [AIController],
  providers: [AIService, GeminiProvider, LocalAIProvider, MockAIProvider],
  exports: [AIService, GeminiProvider],
})
export class AIModule {}
