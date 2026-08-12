import { Test, TestingModule } from '@nestjs/testing';
import { TutorService } from '../tutor/tutor.service';
import { MemoryRetrievalService } from '../memory-retrieval/memory-retrieval.service';
import { AIService } from '../ai/ai.service';
import { PrismaService } from '../prisma/prisma.service';
import { MockAIProvider } from '../ai/providers/mock.provider';

describe('Phase 4 — Personal AI Tutor Engine', () => {
  let tutorService: TutorService;
  let prismaMock: any;

  beforeEach(async () => {
    prismaMock = {
      tutorConversation: {
        findFirst: jest.fn(),
        create: jest.fn().mockResolvedValue({ id: 'conv-p4', title: 'Teach me Java OOP', messages: [] }),
      },
      tutorMessage: {
        create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'msg-p4', ...data })),
      },
      learningMemory: {
        findMany: jest.fn().mockResolvedValue([
          {
            subject: 'Java',
            topic: 'Java OOP',
            concept: 'Encapsulation',
            understandingLevel: 'STRONG',
            isWeakArea: false,
            summary: 'Data hiding using private modifiers',
          },
          {
            subject: 'Java',
            topic: 'Java OOP',
            concept: 'Inheritance',
            understandingLevel: 'UNDERSTOOD',
            isWeakArea: false,
            summary: 'Extending superclass methods',
          },
          {
            subject: 'Java',
            topic: 'Java OOP',
            concept: 'Polymorphism',
            understandingLevel: 'WEAK',
            isWeakArea: true,
            summary: 'Dynamic method dispatch confused',
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
              return Promise.resolve(
                `You already have a good understanding of Encapsulation and Inheritance. Your previous learning indicates that Polymorphism was less clear, so let's focus on that first!`
              );
            }),
          },
        },
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    tutorService = module.get<TutorService>(TutorService);
  });

  it('Phase 4 Test 1: Tutor recognizes previous strong concepts and targets weak areas first', async () => {
    const result = await tutorService.chat('user-p4', 'Teach me Java OOP');

    expect(result).toBeDefined();
    expect(result.conversationId).toBe('conv-p4');
    expect(result.strongConcepts).toContain('Encapsulation');
    expect(result.strongConcepts).toContain('Inheritance');
    expect(result.weakConcepts).toContain('Polymorphism');
    expect(result.reply).toContain('good understanding of Encapsulation and Inheritance');
    expect(result.reply).toContain('Polymorphism was less clear, so let\'s focus on that first!');
  });

  it('Phase 4 Test 2: Tutor handles modes like "Explain Simply"', async () => {
    const result = await tutorService.chat('user-p4', 'What is polymorphism?', undefined, 'explain_simply');

    expect(result).toBeDefined();
    expect(result.reply).toBeDefined();
    expect(prismaMock.tutorMessage.create).toHaveBeenCalled();
  });
});
