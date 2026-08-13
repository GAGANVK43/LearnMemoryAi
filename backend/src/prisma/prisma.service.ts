import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as path from 'path';
import * as fs from 'fs';

function getDatabaseUrl(): string {
  const envUrl = process.env.DATABASE_URL || 'file:./backend/dev.db';
  if (envUrl.startsWith('file:')) {
    const rawPath = envUrl.replace('file:', '');
    let absolutePath = path.isAbsolute(rawPath)
      ? rawPath
      : path.resolve(process.cwd(), rawPath);

    // If file doesn't exist at process.cwd()/rawPath, check backend/dev.db
    if (!fs.existsSync(absolutePath)) {
      const fallbackPath = path.resolve(process.cwd(), 'backend', 'dev.db');
      if (fs.existsSync(fallbackPath)) {
        absolutePath = fallbackPath;
      }
    }

    return `file:${absolutePath}`;
  }
  return envUrl;
}

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    const dbUrl = getDatabaseUrl();
    super({
      datasources: {
        db: {
          url: dbUrl,
        },
      },
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log(`Database connected successfully to SQLite.`);
    } catch (err: any) {
      this.logger.error(
        `Database connection error: ${err.message}.`
      );
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
