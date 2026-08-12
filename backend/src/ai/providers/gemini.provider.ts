import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AIProvider } from '../interfaces/ai-provider.interface';
import { LEARNING_ANALYSIS_SYSTEM_PROMPT, buildLearningAnalysisPrompt } from '../prompts/learning-analysis.prompt';
import { MEMORY_SEARCH_SYSTEM_PROMPT, buildMemorySearchPrompt } from '../prompts/memory-search.prompt';
import { TUTOR_SYSTEM_PROMPT, buildTutorPrompt } from '../prompts/tutor.prompt';

@Injectable()
export class GeminiProvider implements AIProvider {
  name = 'gemini';
  private readonly logger = new Logger(GeminiProvider.name);
  private apiKey: string;
  private modelName: string;
  private aiClient: any;

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('GEMINI_API_KEY') || '';
    this.modelName = this.configService.get<string>('GEMINI_MODEL') || 'gemini-flash-latest';
    this.initClient();
  }

  private initClient() {
    if (!this.apiKey) {
      this.logger.warn('GEMINI_API_KEY is not configured in environment variables.');
      return;
    }
    try {
      const { GoogleGenerativeAI } = require('@google/generative-ai');
      this.aiClient = new GoogleGenerativeAI(this.apiKey);
      this.logger.log(`Initialized GeminiProvider with primary model: ${this.modelName}`);
    } catch (err: any) {
      this.logger.error(`Failed to initialize GoogleGenerativeAI client: ${err.message}`);
    }
  }

  isConfigured(): boolean {
    return Boolean(this.apiKey && this.aiClient);
  }

  getModelName(): string {
    return this.modelName;
  }

  private async generateWithFallback(fullPrompt: string, operationName: string): Promise<string> {
    if (!this.isConfigured()) {
      throw new Error('Gemini API is not configured. Please set GEMINI_API_KEY in environment.');
    }

    const fallbackModels = [
      this.modelName,
      'gemini-flash-latest',
      'gemini-3.5-flash',
      'gemini-3-flash-preview',
      'gemini-3.5-flash-lite',
    ];

    for (const modelCandidate of fallbackModels) {
      try {
        this.logger.log(`[AI] Provider: Gemini | Model: ${modelCandidate} | Operation: ${operationName}`);
        const model = this.aiClient.getGenerativeModel({ model: modelCandidate });
        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        return response.text().trim();
      } catch (err: any) {
        this.logger.warn(`Model ${modelCandidate} failed for ${operationName}: ${err.message}`);
        if (modelCandidate === fallbackModels[fallbackModels.length - 1]) {
          throw new Error(`Gemini ${operationName} Error: ${err.message}`);
        }
      }
    }

    throw new Error(`Gemini ${operationName} Error: All model candidates failed.`);
  }

  async analyzeLearningContent(title: string, subject: string, content: string): Promise<string> {
    const fullPrompt = `${LEARNING_ANALYSIS_SYSTEM_PROMPT}\n\n${buildLearningAnalysisPrompt(title, subject, content)}`;
    return this.generateWithFallback(fullPrompt, 'learning-analysis');
  }

  async answerMemoryQuestion(question: string, memoryContext: string): Promise<string> {
    const fullPrompt = `${MEMORY_SEARCH_SYSTEM_PROMPT}\n\n${buildMemorySearchPrompt(question, memoryContext)}`;
    return this.generateWithFallback(fullPrompt, 'answer-memory-question');
  }

  async generateTutorResponse(
    prompt: string,
    context: string,
    conversationHistory: Array<{ sender: string; content: string }>,
    mode?: string
  ): Promise<string> {
    const historyText = conversationHistory
      .map(m => `${m.sender.toUpperCase()}: ${m.content}`)
      .join('\n');

    const fullPrompt = `${TUTOR_SYSTEM_PROMPT}\n\n${buildTutorPrompt(prompt, context, historyText, mode)}`;
    return this.generateWithFallback(fullPrompt, `chat-tutor-${mode || 'normal'}`);
  }

  async generateStructuredOutput(prompt: string): Promise<any> {
    const text = await this.generateWithFallback(prompt, 'structured-output');
    return JSON.parse(text);
  }

  async analyzeImage(imageBuffer: Buffer, mimeType: string): Promise<string> {
    throw new Error('Multimodal image analysis extension point is not active in primary MVP.');
  }

  async processAudio(audioBuffer: Buffer, mimeType: string): Promise<string> {
    throw new Error('Multimodal audio processing extension point is not active in primary MVP.');
  }

  async createEmbedding(text: string): Promise<number[]> {
    throw new Error('Vector embedding creation extension point is not active in primary MVP.');
  }
}
