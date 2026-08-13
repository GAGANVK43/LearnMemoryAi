import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface MemorySearchResult {
  memories: any[];
  weakAreas: any[];
  summaryText: string;
}

@Injectable()
export class MemoryRetrievalService {
  private readonly logger = new Logger(MemoryRetrievalService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Primary memory retrieval method scoped strictly to authenticated userId
   */
  async retrieveMemoriesForUser(userId: string, query?: string): Promise<MemorySearchResult> {
    this.logger.log(`Retrieving memories for userId: ${userId} with query: "${query || ''}"`);

    const whereClause: any = { userId };

    if (query && query.trim().length > 0) {
      const keywords = query.trim().toLowerCase().split(/\s+/).filter(w => w.length > 2);
      if (keywords.length > 0) {
        whereClause.OR = keywords.flatMap(k => [
          { subject: { contains: k } },
          { topic: { contains: k } },
          { concept: { contains: k } },
          { summary: { contains: k } },
          { explanation: { contains: k } },
        ]);
      }
    }

    let memories = await this.prisma.learningMemory.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    // Fallback: If query returned 0 matches, fetch user's recent memories so Gemini has full context
    if (memories.length === 0) {
      memories = await this.prisma.learningMemory.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 20,
      });
    }

    const weakAreas = await this.prisma.weakArea.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });

    const summaryText = this.buildMemorySummary(memories, weakAreas);

    return {
      memories,
      weakAreas,
      summaryText,
    };
  }

  /**
   * Search by specific subject or topic for a user
   */
  async getMemoriesByTopic(userId: string, topicName: string) {
    return this.prisma.learningMemory.findMany({
      where: {
        userId,
        topic: { contains: topicName.toLowerCase() },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  private buildMemorySummary(memories: any[], weakAreas: any[]): string {
    if (memories.length === 0) {
      return "No matching learning memories found in student history.";
    }

    const lines = memories.map(m => 
      `- [Subject: ${m.subject} | Topic: ${m.topic} | Concept: ${m.concept} | Level: ${m.understandingLevel}${m.isWeakArea ? ' (WEAK AREA)' : ''}]: ${m.summary || m.explanation || ''}`
    );

    const weakLines = weakAreas.map(w => 
      `- Weak Concept: ${w.conceptName} (${w.subject}${w.topic ? ' - ' + w.topic : ''})`
    );

    return `Stored Memories:\n${lines.join('\n')}\n\nIdentified Weak Areas:\n${weakLines.join('\n')}`;
  }
}
