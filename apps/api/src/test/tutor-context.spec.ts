import { Test, TestingModule } from '@nestjs/testing';
import { TutorService } from '../tutor/tutor.service';
import { MemoryRetrievalService } from '../memory-retrieval/memory-retrieval.service';
import { AIService } from '../ai/ai.service';
import { PrismaService } from '../prisma/prisma.service';
import { MockAIProvider } from '../ai/providers/mock.provider';

describe('AI Tutor Memory Context Pipeline', () => {
  let tutorService: TutorService;
  let memoryRetrievalService: MemoryRetrievalService;
  let prismaMock: any;

  beforeEach(async () => {
    prismaMock = {
      tutorConversation: {
        findFirst: jest.fn(),
        create: jest.fn().mockResolvedValue({ id: 'conv-1', title: 'New Tutor Session', messages: [] }),
      },
      tutorMessage: {
        create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'msg-1', ...data })),
      },
      learningMemory: {
        findMany: jest.fn().mockResolvedValue([
          {
            subject: 'Java',
            topic: 'Java OOP',
            concept: 'Polymorphism',
            understandingLevel: 'WEAK',
            isWeakArea: true,
            summary: 'Polymorphism was confusing',
          },
        ]),
      },
      weakArea: {
        findMany: jest.fn().mockResolvedValue([
          { conceptName: 'Polymorphism', subject: 'Java', topic: 'Java OOP' },
        ]),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TutorService,
        MemoryRetrievalService,
        MockAIProvider,
        {
          provide: AIService,
          useValue: {
            generateTutorResponse: jest.fn().mockImplementation((prompt, context, history) => {
              const mock = new MockAIProvider();
              return mock.generateTutorResponse(prompt, context, history);
            }),
          },
        },
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    tutorService = module.get<TutorService>(TutorService);
    memoryRetrievalService = module.get<MemoryRetrievalService>(MemoryRetrievalService);
  });

  it('should inject personal memory context and weak areas into tutor response', async () => {
    const result = await tutorService.chat('user-1', 'Teach me Java OOP');

    expect(result).toBeDefined();
    expect(result.reply).toBeDefined();
    expect(typeof result.reply).toBe('string');
    expect(result.retrievedContextCount).toBe(1);
    expect(prismaMock.tutorMessage.create).toHaveBeenCalled();
  });
});
