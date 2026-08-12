# 🗄️ LearnMemory AI — Database Schema & Data Models

## PostgreSQL Schema via Prisma ORM

Defined in `apps/api/prisma/schema.prisma`.

### Key Models & Relationships

- **User**: Primary identity (`id`, `email`, `name`, `passwordHash`).
- **StudySession**: Raw study input submitted by student (`title`, `subject`, `content`). Belongs to `User`.
- **LearningMemory**: Structured concept memory (`subject`, `topic`, `concept`, `summary`, `explanation`, `keyPoints`, `examples`, `questions`, `understandingLevel`, `confidence`, `isWeakArea`). Belongs to `User` and `StudySession`.
- **Topic**: Grouping entity (`name`, `subject`). Unique constraint: `@@unique([userId, subject, name])`.
- **Concept**: Specific concept entity (`name`, `subject`, `understandingLevel`). Unique constraint: `@@unique([userId, subject, name])`.
- **WeakArea**: Identified student struggle area (`conceptName`, `subject`, `topic`). Unique constraint: `@@unique([userId, subject, conceptName])`.
- **TutorConversation** & **TutorMessage**: Conversation history for interactive AI Tutor sessions.
