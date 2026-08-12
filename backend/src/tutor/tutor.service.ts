import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MemoryRetrievalService } from '../memory-retrieval/memory-retrieval.service';
import { AIService } from '../ai/ai.service';

@Injectable()
export class TutorService {
  constructor(
    private prisma: PrismaService,
    private memoryRetrievalService: MemoryRetrievalService,
    private aiService: AIService,
  ) {}

  async chat(userId: string, messageInput?: string, conversationId?: string, mode?: string) {
    const message = (messageInput || 'Hello').trim();
    let conversation;

    if (conversationId) {
      conversation = await this.prisma.tutorConversation.findFirst({
        where: { id: conversationId, userId },
        include: { messages: { orderBy: { createdAt: 'asc' } } },
      });
      if (!conversation) {
        throw new NotFoundException('Tutor conversation not found.');
      }
    } else {
      conversation = await this.prisma.tutorConversation.create({
        data: {
          userId,
          title: message.substring(0, 30) || 'New Tutor Session',
        },
        include: { messages: true },
      });
    }

    // Save user message to database
    await this.prisma.tutorMessage.create({
      data: {
        conversationId: conversation.id,
        sender: 'user',
        content: message,
      },
    });

    // 1. Retrieve user memories and weak areas using MemoryRetrievalService
    const retrieval = await this.memoryRetrievalService.retrieveMemoriesForUser(userId, message);

    // 2. Build structured personalization context
    const strongConcepts = retrieval.memories
      .filter((m) => m.understandingLevel === 'STRONG' || m.understandingLevel === 'UNDERSTOOD')
      .map((m) => m.concept);

    const weakConcepts = retrieval.weakAreas.map((w) => w.conceptName);

    let contextIntro = '';
    if (strongConcepts.length > 0 || weakConcepts.length > 0) {
      contextIntro = `Student Knowledge Background:\n`;
      if (strongConcepts.length > 0) {
        contextIntro += `- Previously Understood Concepts: ${strongConcepts.join(', ')}\n`;
      }
      if (weakConcepts.length > 0) {
        contextIntro += `- Explicit Weak Areas / Confusions: ${weakConcepts.join(', ')}\n`;
      }
    }

    const fullContext = `${contextIntro}\n${retrieval.summaryText}`;

    // 3. Prepare mode prefix if requested
    let promptWithMessage = message;
    if (mode) {
      switch (mode.toLowerCase()) {
        case 'explain_simply':
          promptWithMessage = `[Mode: Explain Simply for beginner] ${message}`;
          break;
        case 'explain_deeply':
          promptWithMessage = `[Mode: Explain Deeply with technical depth] ${message}`;
          break;
        case 'give_example':
          promptWithMessage = `[Mode: Give practical concrete example] ${message}`;
          break;
        case 'give_hint':
          promptWithMessage = `[Mode: Give hint without giving away full answer] ${message}`;
          break;
        case 'quiz_me':
          promptWithMessage = `[Mode: Quiz me based on my learning history] ${message}`;
          break;
        case 'revise':
          promptWithMessage = `[Mode: Revise previous concepts] ${message}`;
          break;
      }
    }

    // 4. Generate personalized tutor response
    const history = conversation.messages.map((m) => ({ sender: m.sender, content: m.content }));
    const tutorResponse = await this.aiService.generateTutorResponse(
      promptWithMessage,
      fullContext,
      history
    );

    // 5. Save tutor message to database
    const savedTutorMsg = await this.prisma.tutorMessage.create({
      data: {
        conversationId: conversation.id,
        sender: 'tutor',
        content: tutorResponse,
      },
    });

    return {
      conversationId: conversation.id,
      reply: savedTutorMsg.content,
      response: savedTutorMsg.content,
      retrievedContextCount: retrieval.memories.length,
      weakAreas: retrieval.weakAreas,
      strongConcepts,
      weakConcepts,
    };
  }

  async getConversations(userId: string) {
    return this.prisma.tutorConversation.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });
  }

  async getConversationById(userId: string, id: string) {
    const conversation = await this.prisma.tutorConversation.findFirst({
      where: { id, userId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found.');
    }

    return conversation;
  }
}
