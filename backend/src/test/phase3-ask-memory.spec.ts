import { Test, TestingModule } from '@nestjs/testing';
import { MemoryService } from '../memory/memory.service';
import { MemoryRetrievalService } from '../memory-retrieval/memory-retrieval.service';
import { AIService } from '../ai/ai.service';
import { PrismaService } from '../prisma/prisma.service';
import { MockAIProvider } from '../ai/providers/mock.provider';

describe('Phase 3 — Ask My Memory Engine', () => {
  let memoryService: MemoryService;
  let prismaMock: any;

  beforeEach(async () => {
    prismaMock = {
      learningMemory: {
        findMany: jest.fn().mockImplementation(({ where }) => {
          const OR = where?.OR || [];
          const query = OR[0]?.subject?.contains || '';
          
          if (query.includes('quantum')) {
            return Promise.resolve([]);
          }

          if (query.includes('java')) {
            return Promise.resolve([
              {
                id: 'mem-java',
                userId: where.userId,
                subject: 'Java',
                topic: 'OOP',
                concept: 'Encapsulation',
                understandingLevel: 'STRONG',
                summary: 'Java OOP encapsulation concepts',
              },
            ]);
          }

          return Promise.resolve([
            {
              id: 'mem-1',
              userId: where.userId,
              subject: 'Java',
              topic: 'OOP',
              concept: 'Polymorphism',
              understandingLevel: 'WEAK',
              summary: 'Java OOP polymorphism concept',
            },
            {
              id: 'mem-2',
              userId: where.userId,
              subject: 'DSA',
              topic: 'Binary Search',
              concept: 'Recursion',
              understandingLevel: 'WEAK',
              summary: 'Binary search recursion concept',
            },
          ]);
        }),
      },
      weakArea: {
        findMany: jest.fn().mockResolvedValue([
          { conceptName: 'Polymorphism', subject: 'Java', topic: 'OOP' },
        ]),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MemoryService,
        MemoryRetrievalService,
        MockAIProvider,
        {
          provide: AIService,
          useValue: {
            generateTutorResponse: jest.fn().mockImplementation((prompt, context, history) => {
              const mock = new MockAIProvider();
              return mock.generateTutorResponse(prompt, context, history);
            }),
            answerMemoryQuestion: jest.fn().mockImplementation((question, context) => {
              const mock = new MockAIProvider();
              return mock.answerMemoryQuestion(question, context);
            }),
          },
        },
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    memoryService = module.get<MemoryService>(MemoryService);
  });

  it('Phase 3 Test 1: Should answer "What did I learn?" using user memory history', async () => {
    const res = await memoryService.askMemory('user-p3', 'What did I learn?');

    expect(res).toBeDefined();
    expect(res.memoriesFound).toBeGreaterThan(0);
    expect(res.answer).toBeDefined();
  });

  it('Phase 3 Test 2: Should filter Java memories when asking "What did I learn about Java?"', async () => {
    const res = await memoryService.askMemory('user-p3', 'What did I learn about Java?');

    expect(res).toBeDefined();
    expect(res.memoriesFound).toBe(1);
    expect(res.retrievedMemories[0].subject).toBe('Java');
  });

  it('Phase 3 Test 3: Should retrieve weak areas when asking "What are my weak areas?"', async () => {
    const res = await memoryService.askMemory('user-p3', 'What are my weak areas?');

    expect(res).toBeDefined();
    expect(res.weakAreasFound).toBeGreaterThan(0);
  });

  it('Phase 3 Test 4: Should return fallback message when querying unstudied content', async () => {
    prismaMock.weakArea.findMany.mockResolvedValueOnce([]);

    const res = await memoryService.askMemory('user-p3', 'What did I learn about Quantum Physics?');

    expect(res).toBeDefined();
    expect(res.memoriesFound).toBe(0);
    expect(res.answer).toBe("I couldn't find that in your learning memory.");
  });
});
