import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { MemoryService } from './memory.service';

@UseGuards(JwtAuthGuard)
@Controller('memories')
export class MemoryController {
  constructor(private readonly memoryService: MemoryService) {}

  @Get()
  async getMemoriesForUser(@GetUser('id') userId: string) {
    return this.memoryService.getMemoriesForUser(userId);
  }

  @Post('ask')
  async askMemory(@GetUser('id') userId: string, @Body() body: { question: string }) {
    return this.memoryService.askMemory(userId, body.question);
  }

  @Delete(':id')
  async deleteMemory(@GetUser('id') userId: string, @Param('id') id: string) {
    return this.memoryService.deleteMemory(userId, id);
  }
}
