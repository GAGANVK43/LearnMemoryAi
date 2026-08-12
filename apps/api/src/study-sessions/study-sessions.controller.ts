import { Controller, Post, Get, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { StudySessionsService } from './study-sessions.service';

@UseGuards(JwtAuthGuard)
@Controller('study-sessions')
export class StudySessionsController {
  constructor(private readonly studySessionsService: StudySessionsService) {}

  @Post()
  async createSession(
    @GetUser('id') userId: string,
    @Body() body: { title: string; subject: string; content: string }
  ) {
    return this.studySessionsService.createSession(userId, body.title, body.subject, body.content);
  }

  @Get()
  async findAllForUser(@GetUser('id') userId: string) {
    return this.studySessionsService.findAllForUser(userId);
  }

  @Get(':id')
  async findOneForUser(@GetUser('id') userId: string, @Param('id') id: string) {
    return this.studySessionsService.findOneForUser(userId, id);
  }

  @Delete(':id')
  async deleteSession(@GetUser('id') userId: string, @Param('id') id: string) {
    return this.studySessionsService.deleteSession(userId, id);
  }
}
