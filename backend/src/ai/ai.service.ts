import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AIProvider } from './interfaces/ai-provider.interface';
import { GeminiProvider } from './providers/gemini.provider';
import { LocalAIProvider } from './providers/local.provider';
import { MockAIProvider } from './providers/mock.provider';

@Injectable()
export class AIService {
  private activeProvider: AIProvider;
  private readonly logger = new Logger(AIService.name);

  constructor(
    private configService: ConfigService,
    private geminiProvider: GeminiProvider,
    private localAIProvider: LocalAIProvider,
    private mockAIProvider: MockAIProvider,
  ) {
    const providerName = (this.configService.get<string>('AI_PROVIDER') || 'gemini').toLowerCase();
    this.setProvider(providerName);
  }

  setProvider(name: string) {
    switch (name) {
      case 'mock':
        this.activeProvider = this.mockAIProvider;
        break;
      case 'local':
        this.activeProvider = this.localAIProvider;
        break;
      case 'gemini':
      default:
        this.activeProvider = this.geminiProvider;
        break;
    }
    this.logger.log(`Active AI Provider set to: ${this.activeProvider.name}`);
  }

  getProvider(): AIProvider {
    return this.activeProvider;
  }

  async analyzeLearningContent(title: string, subject: string, content: string): Promise<string> {
    try {
      return await this.activeProvider.analyzeLearningContent(title, subject, content);
    } catch (error: any) {
      this.logger.error(`Error in analyzeLearningContent using ${this.activeProvider.name}: ${error.message}`);
      // Do NOT silently switch to MockAIProvider during normal Gemini execution
      throw new InternalServerErrorException(
        `AI Service Error: We couldn't process your study session with ${this.activeProvider.name}. Please check configuration or try again.`
      );
    }
  }

  async answerMemoryQuestion(question: string, memoryContext: string): Promise<string> {
    try {
      return await this.activeProvider.answerMemoryQuestion(question, memoryContext);
    } catch (error: any) {
      this.logger.error(`Error in answerMemoryQuestion using ${this.activeProvider.name}: ${error.message}`);
      throw new InternalServerErrorException(
        `AI Service Error: We couldn't search your learning memory. Please try again.`
      );
    }
  }

  async generateTutorResponse(
    prompt: string,
    context: string,
    conversationHistory: Array<{ sender: string; content: string }>,
    mode?: string
  ): Promise<string> {
    try {
      return await this.activeProvider.generateTutorResponse(prompt, context, conversationHistory, mode);
    } catch (error: any) {
      this.logger.error(`Error in generateTutorResponse using ${this.activeProvider.name}: ${error.message}`);
      throw new InternalServerErrorException(
        `AI Service Error: The AI Tutor is temporarily unavailable. Please try again.`
      );
    }
  }
}
