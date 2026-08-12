import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LearningAnalysisService } from '../learning-analysis/learning-analysis.service';

@Injectable()
export class StudySessionsService {
  constructor(
    private prisma: PrismaService,
    private learningAnalysisService: LearningAnalysisService,
  ) {}

  async createSession(userId: string, title: string, subject: string, content: string) {
    const session = await this.prisma.studySession.create({
      data: {
        userId,
        title,
        subject,
        content,
      },
    });

    // Automatically invoke AI Learning Analysis to generate structured memory
    const analysis = await this.learningAnalysisService.analyzeAndSaveSession({
      userId,
      studySessionId: session.id,
      title: session.title,
      subject: session.subject,
      content: session.content,
    });

    return {
      session,
      analysis,
    };
  }

  async findAllForUser(userId: string) {
    return this.prisma.studySession.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        memories: true,
      },
    });
  }

  async findOneForUser(userId: string, id: string) {
    const session = await this.prisma.studySession.findFirst({
      where: { id, userId },
      include: {
        memories: true,
      },
    });

    if (!session) {
      throw new NotFoundException('Study session not found.');
    }

    return session;
  }

  async deleteSession(userId: string, id: string) {
    const session = await this.prisma.studySession.findFirst({
      where: { id, userId },
    });

    if (!session) {
      throw new NotFoundException('Study session not found.');
    }

    await this.prisma.studySession.delete({
      where: { id },
    });

    return { message: 'Study session deleted successfully.' };
  }
}
