import { z } from 'zod';

export const ConceptAnalysisSchema = z.object({
  name: z.string().min(1),
  understanding: z.enum(['UNKNOWN', 'LEARNING', 'UNDERSTOOD', 'WEAK', 'STRONG']).default('LEARNING'),
  confidence: z.number().min(0).max(1).default(0.8),
  summary: z.string().optional(),
  explanation: z.string().optional(),
  isWeakArea: z.boolean().default(false),
});

export const LearningAnalysisSchema = z.object({
  topic: z.string().min(1),
  subtopics: z.array(z.string()).default([]),
  concepts: z.array(ConceptAnalysisSchema).min(1),
  keyPoints: z.array(z.string()).default([]),
  examples: z.array(z.string()).default([]),
  questions: z.array(z.string()).default([]),
  weakAreas: z.array(z.string()).default([]),
  importantFacts: z.array(z.string()).default([]),
});

export type LearningAnalysisResult = z.infer<typeof LearningAnalysisSchema>;
