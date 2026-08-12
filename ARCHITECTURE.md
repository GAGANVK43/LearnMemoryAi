# 📐 LearnMemory AI — System Architecture Guide

## Monorepo Layout

```
learnmemory-ai/
├── apps/
│   ├── web/                     # Next.js 14 App Router Frontend
│   └── api/                     # NestJS Backend API
├── .env.example
├── .env
├── README.md
├── SETUP.md
├── ARCHITECTURE.md
├── AI_ARCHITECTURE.md
└── DATABASE.md
```

## Security & Data Scoping Layer

```
Browser Request
   │ (HttpOnly Cookie: jwt)
   ▼
NestJS JwtAuthGuard
   │ (Decodes payload -> req.user)
   ▼
Controllers & Services
   │ (Strict scope: where { userId: req.user.id })
   ▼
Prisma ORM
   ▼
PostgreSQL Database
```

Every database query is strictly scoped to `authenticatedUser.id`. Client-supplied `userId` parameters are strictly prohibited.
