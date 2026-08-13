import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MemoryRetrievalService } from '../memory-retrieval/memory-retrieval.service';
import { AIService } from '../ai/ai.service';

@Injectable()
export class QuizService {
  constructor(
    private prisma: PrismaService,
    private memoryRetrievalService: MemoryRetrievalService,
    private aiService: AIService,
  ) {}

  async generateQuiz(userId: string, targetTopic?: string, difficultyLevel: string = 'MEDIUM') {
    // Retrieve user memories and weak areas
    const retrieval = await this.memoryRetrievalService.retrieveMemoriesForUser(userId, targetTopic || '');

    const selectedTopic = targetTopic || (retrieval.memories[0]?.topic) || 'General Learning';
    const selectedSubject = retrieval.memories[0]?.subject || 'General';

    const weakConceptNames = retrieval.weakAreas.map((w) => w.conceptName).join(', ');
    const memorySummaries = retrieval.memories.map((m) => `${m.concept}: ${m.summary}`).join('\n');

    const prompt = `Generate a 5-question ${difficultyLevel} quiz about '${selectedTopic}' (${selectedSubject}) for a student.
Student Weak Areas to prioritize: ${weakConceptNames || 'None specified'}
Student Memory Bank Context:
${memorySummaries || 'No previous memories.'}

Return ONLY valid JSON matching this exact structure (no markdown fences, no extra text):
{
  "questions": [
    {
      "questionText": "Question string?",
      "type": "MCQ",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option A",
      "explanation": "Brief explanation why Option A is correct."
    }
  ]
}`;

    let parsedOutput;
    try {
      parsedOutput = await this.aiService.generateStructuredOutput(prompt);
    } catch (err) {
      // Fallback structured questions if Gemini call fails
      parsedOutput = {
        questions: [
          {
            questionText: `What is a core principle of ${selectedTopic}?`,
            type: 'MCQ',
            options: ['Encapsulation & Structure', 'Infinite Loops', 'Global State Only', 'None of the above'],
            correctAnswer: 'Encapsulation & Structure',
            explanation: `${selectedTopic} relies on structured organization of components.`,
          },
          {
            questionText: `Which concept relates to ${selectedTopic}?`,
            type: 'MCQ',
            options: ['Data Hiding', 'Hardware Assembly', 'Binary Encoding', 'Manual File Allocation'],
            correctAnswer: 'Data Hiding',
            explanation: 'Concepts are organized to protect internal implementation details.',
          },
        ],
      };
    }

    const quiz = await this.prisma.quiz.create({
      data: {
        userId,
        topic: selectedTopic,
        subject: selectedSubject,
        difficulty: difficultyLevel,
        questions: {
          create: (parsedOutput.questions || []).map((q: any) => ({
            questionText: q.questionText || 'Sample question?',
            type: q.type || 'MCQ',
            options: Array.isArray(q.options) ? JSON.stringify(q.options) : JSON.stringify(['A', 'B', 'C', 'D']),
            correctAnswer: q.correctAnswer || (q.options ? q.options[0] : 'A'),
            explanation: q.explanation || 'Correct answer based on learning topic.',
          })),
        },
      },
      include: {
        questions: true,
      },
    });

    return {
      quizId: quiz.id,
      topic: quiz.topic,
      subject: quiz.subject,
      difficulty: quiz.difficulty,
      questions: quiz.questions.map((q) => ({
        id: q.id,
        questionText: q.questionText,
        type: q.type,
        options: q.options ? JSON.parse(q.options) : [],
        explanation: q.explanation,
      })),
    };
  }

  async evaluateQuiz(userId: string, quizId: string, userAnswers: Record<string, string>) {
    const quiz = await this.prisma.quiz.findFirst({
      where: { id: quizId, userId },
      include: { questions: true },
    });

    if (!quiz) {
      throw new NotFoundException('Quiz not found or unauthorized.');
    }

    let correctCount = 0;
    const totalQuestions = quiz.questions.length;
    const evalResults: any[] = [];

    for (const q of quiz.questions) {
      const userAnswer = (userAnswers[q.id] || '').trim();
      const isCorrect = userAnswer.toLowerCase() === q.correctAnswer.toLowerCase();
      if (isCorrect) correctCount++;

      evalResults.push({
        questionId: q.id,
        questionText: q.questionText,
        userAnswer,
        correctAnswer: q.correctAnswer,
        isCorrect,
        explanation: q.explanation,
      });

      // If user got question wrong, track/update weak area
      if (!isCorrect) {
        await this.prisma.weakArea.upsert({
          where: {
            userId_subject_conceptName: {
              userId,
              subject: quiz.subject,
              conceptName: quiz.topic,
            },
          },
          update: { updatedAt: new Date() },
          create: {
            userId,
            subject: quiz.subject,
            topic: quiz.topic,
            conceptName: quiz.topic,
          },
        }).catch(() => null);
      }
    }

    const scorePercentage = (correctCount / totalQuestions) * 100;
    const feedback = scorePercentage >= 80 
      ? 'Excellent job! You have mastered this concept.' 
      : 'Good effort! Review your weak areas to boost your retention.';

    const attempt = await this.prisma.quizAttempt.create({
      data: {
        userId,
        quizId: quiz.id,
        score: scorePercentage,
        totalQuestions,
        userAnswers: JSON.stringify(userAnswers),
        feedback,
      },
    });

    return {
      attemptId: attempt.id,
      score: scorePercentage,
      totalQuestions,
      correctCount,
      feedback,
      evalResults,
    };
  }
}
