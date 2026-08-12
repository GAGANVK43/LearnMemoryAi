import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StatsService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats(userId: string) {
    const studySessionsCount = await this.prisma.studySession.count({ where: { userId } });
    const topicsLearnedCount = await this.prisma.topic.count({ where: { userId } });
    const conceptsCount = await this.prisma.concept.count({ where: { userId } });
    const weakAreasCount = await this.prisma.weakArea.count({ where: { userId } });

    const recentLearning = await this.prisma.learningMemory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        subject: true,
        topic: true,
        concept: true,
        understandingLevel: true,
        isWeakArea: true,
        createdAt: true,
      },
    });

    const weakAreasList = await this.prisma.weakArea.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      take: 5,
    });

    return {
      studySessionsCount,
      topicsLearnedCount,
      conceptsCount,
      weakAreasCount,
      recentLearning,
      weakAreasList,
    };
  }
}
