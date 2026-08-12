import { Injectable } from '@nestjs/common';
import { AIProvider } from '../interfaces/ai-provider.interface';

@Injectable()
export class MockAIProvider implements AIProvider {
  name = 'mock';

  async analyzeLearningContent(title: string, subject: string, content: string): Promise<string> {
    const isWeak = content.toLowerCase().includes('confus') || content.toLowerCase().includes('left and right pointers');

    return JSON.stringify({
      topic: title || 'Binary Search',
      subtopics: ['Binary Search', 'Two Pointers'],
      concepts: [
        {
          name: title || 'Binary Search Algorithm',
          understanding: isWeak ? 'WEAK' : 'UNDERSTOOD',
          confidence: isWeak ? 0.4 : 0.9,
          summary: `Summary for ${title}`,
          explanation: `Detailed explanation of ${title}`,
          isWeakArea: isWeak,
        },
      ],
      keyPoints: ['Key point 1', 'Key point 2'],
      examples: ['Binary search in sorted array'],
      questions: ['When to adjust left pointer?'],
      weakAreas: isWeak ? ['pointer boundaries'] : [],
      importantFacts: ['Binary search runs in O(log n) time'],
    });
  }

  async answerMemoryQuestion(question: string, memoryContext: string): Promise<string> {
    if (!memoryContext || memoryContext.includes('No stored learning memories')) {
      return "I couldn't find that in your learning memory.";
    }
    return `Based on your stored learning memory context, here is what you learned: ${memoryContext.substring(0, 150)}...`;
  }

  async generateTutorResponse(
    prompt: string,
    context: string,
    conversationHistory: Array<{ sender: string; content: string }>,
    mode?: string
  ): Promise<string> {
    if (context.toLowerCase().includes('pointer boundaries') || context.toLowerCase().includes('weak') || context.toLowerCase().includes('polymorphism')) {
      return `You already have a good understanding of encapsulation and inheritance. Your previous learning indicates that polymorphism was less clear, so let's focus on that first! In Java OOP, polymorphism allows objects to take on many forms via dynamic method dispatch.`;
    }
    return `Binary search works by halving the search space on each step. Since your memory shows good understanding, here is a quick review.`;
  }
}
