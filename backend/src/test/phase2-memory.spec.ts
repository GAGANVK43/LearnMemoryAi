import { Test, TestingModule } from '@nestjs/testing';
import { LearningAnalysisService } from '../learning-analysis/learning-analysis.service';
import { MemoryRetrievalService } from '../memory-retrieval/memory-retrieval.service';
import { AIService } from '../ai/ai.service';
import { PrismaService } from '../prisma/prisma.service';
import { MockAIProvider } from '../ai/providers/mock.provider';

describe('Phase 2 — Learning Memory Pipeline', () => {
  let learningAnalysisService: LearningAnalysisService;
  let memoryRetrievalService: MemoryRetrievalService;
  let prismaMock: any;

  beforeEach(async () => {
    prismaMock = {
      learningMemory: {
        create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'mem-123', ...data })),
        findMany: jest.fn().mockImplementation(({ where }) => {
          return Promise.resolve([
            {
              id: 'mem-123',
              userId: where.userId,
              subject: 'Java',
              topic: 'OOP',
              concept: 'Polymorphism',
              understandingLevel: 'WEAK',
              isWeakArea: true,
              summary: 'Polymorphism dynamic dispatch',
            },
          ]);
        }),
      },
      topic: {
        upsert: jest.fn().mockResolvedValue({ id: 'topic-123', name: 'OOP' }),
      },
      concept: {
        upsert: jest.fn().mockResolvedValue({ id: 'concept-123', name: 'Polymorphism' }),
      },
      weakArea: {
        upsert: jest.fn().mockResolvedValue({ id: 'weak-123', conceptName: 'Polymorphism' }),
        findMany: jest.fn().mockResolvedValue([{ conceptName: 'Polymorphism', subject: 'Java', topic: 'OOP' }]),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LearningAnalysisService,
        MemoryRetrievalService,
        MockAIProvider,
        {
          provide: AIService,
          useValue: {
            analyzeLearningContent: jest.fn().mockImplementation((title, subject, content) => {
              const mock = new MockAIProvider();
              return mock.analyzeLearningContent(title, subject, content);
            }),
          },
        },
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    learningAnalysisService = module.get<LearningAnalysisService>(LearningAnalysisService);
    memoryRetrievalService = module.get<MemoryRetrievalService>(MemoryRetrievalService);
  });

  it('Phase 2 Test 1: Analysis extracts structured memory and executes upserts to avoid duplicates', async () => {
    const analysis = await learningAnalysisService.analyzeAndSaveSession({
      userId: 'user-phase2',
      studySessionId: 'session-phase2',
      title: 'Java OOP',
      subject: 'Java',
      content: 'Today I studied OOP in Java. Encapsulation is clear but polymorphism is confused.',
    });

    expect(analysis).toBeDefined();
    expect(analysis.memoriesCreated).toBeGreaterThan(0);
    expect(prismaMock.learningMemory.create).toHaveBeenCalled();
    expect(prismaMock.topic.upsert).toHaveBeenCalled();
    expect(prismaMock.concept.upsert).toHaveBeenCalled();
  });

  it('Phase 2 Test 2: Memory Retrieval Service returns user-isolated memories with query filtering', async () => {
    const result = await memoryRetrievalService.retrieveMemoriesForUser('user-phase2', 'Polymorphism');

    expect(result).toBeDefined();
    expect(result.memories.length).toBe(1);
    expect(result.memories[0].concept).toBe('Polymorphism');
    expect(result.summaryText).toContain('Polymorphism');
    expect(result.summaryText).toContain('WEAK AREA');
  });
});
