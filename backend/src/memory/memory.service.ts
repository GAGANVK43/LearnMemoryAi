import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MemoryRetrievalService } from '../memory-retrieval/memory-retrieval.service';
import { AIService } from '../ai/ai.service';

@Injectable()
export class MemoryService {
  constructor(
    private prisma: PrismaService,
    private memoryRetrievalService: MemoryRetrievalService,
    private aiService: AIService,
  ) {}

  async getMemoriesForUser(userId: string) {
    return this.prisma.learningMemory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async askMemory(userId: string, question: string) {
    const qLower = question.toLowerCase().trim();

    // Check if the query is a broad/general question (e.g. "What did I learn today?", "What have I studied?")
    const isBroadQuery =
      qLower === 'what did i learn' ||
      qLower === 'what did i learn today' ||
      qLower === 'what did i study' ||
      qLower === 'what did i study today' ||
      qLower.includes('what did i learn') ||
      qLower.includes('what have i learned') ||
      qLower.includes('what did i study') ||
      qLower.includes('weak areas') ||
      qLower === 'what are my weak areas';

    let searchQuery: string | undefined = undefined;

    if (!isBroadQuery) {
      if (qLower.startsWith('what did i learn about ')) {
        searchQuery = question.substring('what did i learn about '.length).trim();
      } else if (qLower.startsWith('what did i learn on ')) {
        searchQuery = question.substring('what did i learn on '.length).trim();
      } else {
        searchQuery = question;
      }
    }

    const retrieval = await this.memoryRetrievalService.retrieveMemoriesForUser(userId, searchQuery);

    // If no stored memories exist at all for this user
    if (retrieval.memories.length === 0 && retrieval.weakAreas.length === 0) {
      return {
        answer: "I couldn't find that in your learning memory.",
        memoriesFound: 0,
        retrievedMemories: [],
      };
    }

    const context = retrieval.summaryText;

    const answer = await this.aiService.answerMemoryQuestion(
      question,
      context
    );

    return {
      answer,
      memoriesFound: retrieval.memories.length,
      retrievedMemories: retrieval.memories,
      weakAreasFound: retrieval.weakAreas.length,
    };
  }

  async deleteMemory(userId: string, id: string) {
    const memory = await this.prisma.learningMemory.findFirst({
      where: { id, userId },
    });

    if (!memory) {
      throw new NotFoundException('Memory item not found.');
    }

    await this.prisma.learningMemory.delete({
      where: { id },
    });

    return { message: 'Memory deleted successfully.' };
  }
}
