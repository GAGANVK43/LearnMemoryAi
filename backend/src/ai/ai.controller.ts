import { Controller, Get } from '@nestjs/common';
import { AIService } from './ai.service';
import { GeminiProvider } from './providers/gemini.provider';

@Controller('ai')
export class AIController {
  constructor(
    private readonly aiService: AIService,
    private readonly geminiProvider: GeminiProvider,
  ) {}

  @Get('health')
  getAIHealth() {
    const activeProvider = this.aiService.getProvider();
    const isGemini = activeProvider.name === 'gemini';

    return {
      provider: activeProvider.name,
      configured: isGemini ? this.geminiProvider.isConfigured() : true,
      model: isGemini ? this.geminiProvider.getModelName() : 'n/a',
      status: 'active',
      timestamp: new Date().toISOString(),
    };
  }
}
