import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { TutorService } from './tutor.service';

@UseGuards(JwtAuthGuard)
@Controller('tutor')
export class TutorController {
  constructor(private readonly tutorService: TutorService) {}

  @Post('chat')
  async chat(
    @GetUser('id') userId: string,
    @Body() body: { message?: string; prompt?: string; question?: string; conversationId?: string; mode?: string }
  ) {
    const userMessage = body.message || body.prompt || body.question || 'Hello';
    return this.tutorService.chat(userId, userMessage, body.conversationId, body.mode);
  }

  @Get('conversations')
  async getConversations(@GetUser('id') userId: string) {
    return this.tutorService.getConversations(userId);
  }

  @Get('conversations/:id')
  async getConversationById(@GetUser('id') userId: string, @Param('id') id: string) {
    return this.tutorService.getConversationById(userId, id);
  }
}
