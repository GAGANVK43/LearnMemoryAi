import { Test, TestingModule } from '@nestjs/testing';
import { LearningAnalysisService } from '../learning-analysis/learning-analysis.service';
import { AIService } from '../ai/ai.service';
import { PrismaService } from '../prisma/prisma.service';
import { MockAIProvider } from '../ai/providers/mock.provider';

describe('LearningAnalysisService (AI & Zod Validation)', () => {
  let service: LearningAnalysisService;
  let prismaMock: any;

  beforeEach(async () => {
    prismaMock = {
      learningMemory: {
        create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'mem-1', ...data })),
      },
      topic: {
        upsert: jest.fn().mockResolvedValue({ id: 'topic-1' }),
      },
      concept: {
        upsert: jest.fn().mockResolvedValue({ id: 'concept-1' }),
      },
      weakArea: {
        upsert: jest.fn().mockResolvedValue({ id: 'weak-1' }),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LearningAnalysisService,
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

    service = module.get<LearningAnalysisService>(LearningAnalysisService);
  });

  it('should analyze content, validate output with Zod, and persist structured memories', async () => {
    const result = await service.analyzeAndSaveSession({
      userId: 'user-1',
      studySessionId: 'session-1',
      title: 'Binary Search',
      subject: 'DSA',
      content: 'Today I learned binary search. I understand the algorithm but am confused about left and right pointers.',
    });

    expect(result).toBeDefined();
    expect(result.topic).toBe('Binary Search');
    expect(result.memoriesCreated).toBeGreaterThan(0);
    expect(prismaMock.learningMemory.create).toHaveBeenCalled();
    expect(prismaMock.topic.upsert).toHaveBeenCalled();
    expect(prismaMock.concept.upsert).toHaveBeenCalled();
  });
});
