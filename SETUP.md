# 🛠️ LearnMemory AI — Setup & Local Execution Guide

Follow these steps for local zero-cost development.

## 1. Environment Setup

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Default configuration:
```env
PORT=4000
WEB_URL="http://localhost:3000"
API_URL="http://localhost:4000/api"
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/learnmemory_db?schema=public"
JWT_SECRET="learnmemory_super_secret_jwt_key_2026_change_in_prod"
AI_PROVIDER="mock" # Change to 'gemini' when GEMINI_API_KEY is provided
GEMINI_API_KEY=""
```

---

## 2. Installation & Build

Install workspace dependencies:
```bash
npm install
```

Generate Prisma Client:
```bash
npx prisma generate --schema=apps/api/prisma/schema.prisma
```

Seed Demo Data:
```bash
npx ts-node apps/api/prisma/seed.ts
```

---

## 3. Running Services

Run API Backend (NestJS):
```bash
npm run start:dev --workspace=apps/api
```
API runs at: `http://localhost:4000/api`

Run Web Frontend (Next.js):
```bash
npm run dev --workspace=apps/web
```
Web app runs at: `http://localhost:3000`

---

## 4. Running Automated Test Suites

```bash
npx jest --config apps/api/jest.config.js
```
Includes tests for:
- Security & User Data Isolation
- AI Output Zod Validation
- Memory Retrieval Search
- AI Tutor Personalization Context
