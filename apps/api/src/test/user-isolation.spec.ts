import { Test, TestingModule } from '@nestjs/testing';
import { StudySessionsService } from '../study-sessions/study-sessions.service';
import { MemoryService } from '../memory/memory.service';
import { PrismaService } from '../prisma/prisma.service';
import { LearningAnalysisService } from '../learning-analysis/learning-analysis.service';
import { MemoryRetrievalService } from '../memory-retrieval/memory-retrieval.service';
import { AIService } from '../ai/ai.service';
import { ConfigService } from '@nestjs/config';

describe('User Data Isolation (Security)', () => {
  let studySessionsService: StudySessionsService;
  let memoryService: MemoryService;
  let prismaMock: any;

  beforeEach(async () => {
    prismaMock = {
      studySession: {
        findFirst: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        delete: jest.fn(),
      },
      learningMemory: {
        findFirst: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        delete: jest.fn(),
      },
      weakArea: {
        findMany: jest.fn().mockResolvedValue([]),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudySessionsService,
        MemoryService,
        MemoryRetrievalService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: LearningAnalysisService, useValue: { analyzeAndSaveSession: jest.fn() } },
        { provide: AIService, useValue: { generateTutorResponse: jest.fn() } },
        { provide: ConfigService, useValue: { get: jest.fn() } },
      ],
    }).compile();

    studySessionsService = module.get<StudySessionsService>(StudySessionsService);
    memoryService = module.get<MemoryService>(MemoryService);
  });

  it("User B should not be able to retrieve User A's study session", async () => {
    prismaMock.studySession.findFirst.mockResolvedValue(null);

    await expect(
      studySessionsService.findOneForUser('userB-id', 'userA-session-id')
    ).rejects.toThrow('Study session not found.');

    expect(prismaMock.studySession.findFirst).toHaveBeenCalledWith({
      where: { id: 'userA-session-id', userId: 'userB-id' },
      include: { memories: true },
    });
  });

  it("User B should not be able to delete User A's learning memory", async () => {
    prismaMock.learningMemory.findFirst.mockResolvedValue(null);

    await expect(
      memoryService.deleteMemory('userB-id', 'userA-memory-id')
    ).rejects.toThrow('Memory item not found.');

    expect(prismaMock.learningMemory.findFirst).toHaveBeenCalledWith({
      where: { id: 'userA-memory-id', userId: 'userB-id' },
    });
  });
});
