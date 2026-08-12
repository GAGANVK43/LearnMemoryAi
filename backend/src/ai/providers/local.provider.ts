import { Injectable, Logger } from '@nestjs/common';
import { AIProvider } from '../interfaces/ai-provider.interface';

@Injectable()
export class LocalAIProvider implements AIProvider {
  name = 'local';
  private readonly logger = new Logger(LocalAIProvider.name);

  async analyzeLearningContent(title: string, subject: string, content: string): Promise<string> {
    this.logger.log(`LocalAIProvider analyzing session: "${title}" (${subject})`);
    
    const isWeak = content.toLowerCase().includes('confus') || content.toLowerCase().includes("don't understand") || content.toLowerCase().includes('hard');

    const result = {
      topic: title || subject || 'General Topic',
      subtopics: [subject, title],
      concepts: [
        {
          name: title || 'Core Concept',
          understanding: isWeak ? 'WEAK' : 'UNDERSTOOD',
          confidence: isWeak ? 0.4 : 0.85,
          summary: `Summary of ${title} in ${subject}`,
          explanation: content.substring(0, 200),
          isWeakArea: isWeak,
        },
      ],
      keyPoints: [
        `Understood core ideas of ${title}`,
        `Studied ${subject}`,
      ],
      examples: [`Practical example of ${title}`],
      questions: [`How does ${title} work in production?`],
      weakAreas: isWeak ? [title] : [],
      importantFacts: [`Key fact about ${subject}`],
    };

    return JSON.stringify(result);
  }

  async answerMemoryQuestion(question: string, memoryContext: string): Promise<string> {
    if (!memoryContext || memoryContext.includes('No stored learning memories')) {
      return "I couldn't find that in your learning memory.";
    }
    return `[Local AI]: Based on your learning history: ${memoryContext.substring(0, 150)}...`;
  }

  async generateTutorResponse(
    prompt: string,
    context: string,
    conversationHistory: Array<{ sender: string; content: string }>,
    mode?: string
  ): Promise<string> {
    return `[Local AI Tutor]: Based on your learning history (${context || 'no context'}), here is an explanation for "${prompt}": Keep practicing core principles!`;
  }
}
