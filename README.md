# 🧠 LearnMemory AI — Personal Learning Memory & AI Tutor

> **TAGLINE**: *"An AI that remembers what you learn and teaches it back to you."*

LearnMemory AI turns student study sessions into structured learning memories and uses that memory bank to teach students based on their previous knowledge and identified weak areas.

---

## 🎯 Core Hypothesis & Product Flow

```
STUDENT → Creates Account → Submits Study Session → AI Analyzes & Extracts Memory → Stores Personal Memory
   ↓
Student asks: "What did I learn?" → Memory Retrieval → AI recalls previous knowledge
   ↓
Student asks AI Tutor: "Teach me Java OOP" → AI acknowledges strong concepts & targets weak areas first!
```

---

## 🚀 Key Features

1. **HttpOnly Cookie Authentication**: Private student memory isolated at database level (`where: userId`).
2. **Study Sessions**: Submit raw study notes or session text.
3. **AI Learning Analysis**: Automated extraction of topics, concepts, understanding levels, key points, examples, and weak areas validated via Zod schema.
4. **Structured Personal Memory**: Deduplicated concept graph stored in PostgreSQL via Prisma ORM.
5. **Ask My Memory**: Natural language query engine backed by stored student memories.
6. **Personal AI Tutor**: Adaptive AI Tutor with 6 learning modes (`Explain Simply`, `Explain Deeply`, `Give Example`, `Give Hint`, `Quiz Me`, `Revise`).
7. **Real-time Dashboard**: Live student stats (Sessions, Topics, Concepts, Weak Areas, Recent Learning).

---

## 📦 Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Lucide Icons.
- **Backend**: NestJS, TypeScript, Passport JWT with HttpOnly cookies, Zod validation.
- **Database**: PostgreSQL & Prisma ORM.
- **AI Engine**: Provider Abstraction (`GeminiProvider` via `@google/generative-ai`, `LocalAIProvider`, `MockAIProvider`).

---

## 📄 Documentation Links

- [Setup Guide](SETUP.md)
- [Architecture Guide](ARCHITECTURE.md)
- [AI Architecture](AI_ARCHITECTURE.md)
- [Database Schema](DATABASE.md)
