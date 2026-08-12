import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AIService } from '../ai/ai.service';
import { LearningAnalysisSchema, LearningAnalysisResult } from './schemas/learning-analysis.schema';

@Injectable()
export class LearningAnalysisService {
  private readonly logger = new Logger(LearningAnalysisService.name);

  constructor(
    private prisma: PrismaService,
    private aiService: AIService,
  ) {}

  async analyzeAndSaveSession(params: {
    userId: string;
    studySessionId: string;
    title: string;
    subject: string;
    content: string;
  }) {
    const { userId, studySessionId, title, subject, content } = params;

    this.logger.log(`Starting AI learning analysis for session ${studySessionId} (User: ${userId})`);

    let parsedResult: LearningAnalysisResult | null = null;
    let attempts = 0;
    const maxAttempts = 2;

    while (attempts < maxAttempts && !parsedResult) {
      attempts++;
      this.logger.log(`AI Learning Analysis Attempt ${attempts}/${maxAttempts}...`);
      
      const rawAIResponse = await this.aiService.analyzeLearningContent(title, subject, content);
      parsedResult = this.validateAndNormalizeAIResponse(rawAIResponse, title, subject, content);
    }

    if (!parsedResult) {
      this.logger.error(`AI analysis returned invalid or unparseable JSON after ${maxAttempts} attempts for study session ${studySessionId}`);
      throw new BadRequestException("We couldn't analyze this study session format. Please try submitting again with clear notes.");
    }

    const createdMemories = [];

    // Save structured memories for each extracted concept
    for (const concept of parsedResult.concepts) {
      const memory = await this.prisma.learningMemory.create({
        data: {
          userId,
          studySessionId,
          subject,
          topic: parsedResult.topic,
          concept: concept.name,
          summary: concept.summary || `${concept.name} concept in ${parsedResult.topic}`,
          explanation: concept.explanation || content.substring(0, 300),
          keyPoints: JSON.stringify(parsedResult.keyPoints),
          examples: JSON.stringify(parsedResult.examples),
          questions: JSON.stringify(parsedResult.questions),
          understandingLevel: concept.understanding,
          confidence: concept.confidence,
          isWeakArea: concept.isWeakArea || parsedResult.weakAreas.includes(concept.name),
        },
      });
      createdMemories.push(memory);

      // Upsert Topic (avoid duplicates)
      const topicRecord = await this.prisma.topic.upsert({
        where: {
          userId_subject_name: {
            userId,
            subject,
            name: parsedResult.topic,
          },
        },
        update: { updatedAt: new Date() },
        create: {
          userId,
          subject,
          name: parsedResult.topic,
        },
      });

      // Upsert Concept (avoid duplicates)
      await this.prisma.concept.upsert({
        where: {
          userId_subject_name: {
            userId,
            subject,
            name: concept.name,
          },
        },
        update: {
          understandingLevel: concept.understanding,
          topicId: topicRecord.id,
          updatedAt: new Date(),
        },
        create: {
          userId,
          subject,
          name: concept.name,
          topicId: topicRecord.id,
          understandingLevel: concept.understanding,
        },
      });

      // Upsert WeakArea if flagged as weak
      if (concept.isWeakArea || parsedResult.weakAreas.includes(concept.name) || concept.understanding === 'WEAK') {
        await this.prisma.weakArea.upsert({
          where: {
            userId_subject_conceptName: {
              userId,
              subject,
              conceptName: concept.name,
            },
          },
          update: {
            topic: parsedResult.topic,
            updatedAt: new Date(),
          },
          create: {
            userId,
            subject,
            conceptName: concept.name,
            topic: parsedResult.topic,
          },
        });
      }
    }

    return {
      topic: parsedResult.topic,
      subtopics: parsedResult.subtopics,
      memoriesCreated: createdMemories.length,
      memories: createdMemories,
    };
  }

  private validateAndNormalizeAIResponse(
    rawResponse: string,
    fallbackTitle: string,
    fallbackSubject: string,
    fallbackContent: string
  ): LearningAnalysisResult | null {
    try {
      let cleanResponse = rawResponse.trim();
      
      // Strip markdown code fence if present
      if (cleanResponse.startsWith('```json')) {
        cleanResponse = cleanResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanResponse.startsWith('```')) {
        cleanResponse = cleanResponse.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }

      const rawJson = JSON.parse(cleanResponse);

      // Smart normalization for key names
      const normalizedJson: any = {
        topic: rawJson.topic || rawJson.mainTopic || rawJson.title || fallbackTitle || 'General Study Session',
        subtopics: Array.isArray(rawJson.subtopics) ? rawJson.subtopics : [fallbackSubject],
        keyPoints: Array.isArray(rawJson.keyPoints) ? rawJson.keyPoints : [],
        examples: Array.isArray(rawJson.examples) ? rawJson.examples : [],
        questions: Array.isArray(rawJson.questions) ? rawJson.questions : [],
        weakAreas: Array.isArray(rawJson.weakAreas) ? rawJson.weakAreas : [],
        importantFacts: Array.isArray(rawJson.importantFacts) ? rawJson.importantFacts : [],
        concepts: [],
      };

      if (Array.isArray(rawJson.concepts) && rawJson.concepts.length > 0) {
        normalizedJson.concepts = rawJson.concepts.map((c: any) => ({
          name: c.name || c.conceptName || c.title || normalizedJson.topic,
          understanding: (['UNKNOWN', 'LEARNING', 'UNDERSTOOD', 'WEAK', 'STRONG'].includes(c.understanding?.toUpperCase())
            ? c.understanding.toUpperCase()
            : (c.isWeakArea ? 'WEAK' : 'UNDERSTOOD')),
          confidence: typeof c.confidence === 'number' ? c.confidence : 0.8,
          summary: c.summary || `Extracted concept: ${c.name || fallbackTitle}`,
          explanation: c.explanation || fallbackContent.substring(0, 300),
          isWeakArea: Boolean(c.isWeakArea || (c.understanding?.toUpperCase() === 'WEAK')),
        }));
      } else {
        // Fallback concept if AI did not provide concepts array
        normalizedJson.concepts = [
          {
            name: fallbackTitle || 'Core Concept',
            understanding: 'UNDERSTOOD',
            confidence: 0.8,
            summary: `Summary of ${fallbackTitle}`,
            explanation: fallbackContent.substring(0, 300),
            isWeakArea: false,
          },
        ];
      }

      const validation = LearningAnalysisSchema.safeParse(normalizedJson);

      if (validation.success) {
        return validation.data;
      } else {
        this.logger.warn(`Zod schema validation failed: ${JSON.stringify(validation.error.format())}`);
        return null;
      }
    } catch (err: any) {
      this.logger.warn(`Failed to parse AI raw response as JSON: ${err.message}`);
      return null;
    }
  }
}
