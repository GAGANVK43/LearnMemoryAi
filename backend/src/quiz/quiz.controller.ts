import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { QuizService } from './quiz.service';

@UseGuards(JwtAuthGuard)
@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post('generate')
  async generateQuiz(
    @GetUser('id') userId: string,
    @Body() body: { topic?: string; difficulty?: string }
  ) {
    return this.quizService.generateQuiz(userId, body.topic, body.difficulty);
  }

  @Post('evaluate')
  async evaluateQuiz(
    @GetUser('id') userId: string,
    @Body() body: { quizId: string; userAnswers: Record<string, string> }
  ) {
    return this.quizService.evaluateQuiz(userId, body.quizId, body.userAnswers);
  }
}
