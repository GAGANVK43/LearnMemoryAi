# 🤖 LearnMemory AI — AI Architecture & Provider Abstraction

## Overview

The AI engine in LearnMemory AI is decoupled behind an `AIProvider` interface.

```
                   ┌──────────────────────────────┐
                   │          AIService           │
                   └──────────────┬───────────────┘
                                  │
         ┌────────────────────────┼────────────────────────┐
         │                        │                        │
┌────────▼─────────┐    ┌─────────▼────────┐    ┌──────────▼────────┐
│  GeminiProvider  │    │  LocalAIProvider │    │   MockAIProvider  │
│(@google/generative-ai)│    │(Open-Source Local│    │ (Purely for Unit │
│                  │    │      Models)     │    │      Testing)     │
└──────────────────┘    └──────────────────┘    └───────────────────┘
```

## Security & Injection Defense

User notes and learning memories are encapsulated inside explicit XML-like data tags:

```
<STUDENT_LEARNING_DATA>
Memory History:
- Subject: Java | Concept: Polymorphism | Level: WEAK (WEAK AREA)

Identified Weak Areas:
- Polymorphism
</STUDENT_LEARNING_DATA>
```

System prompts instruct the LLM to treat `<STUDENT_LEARNING_DATA>` strictly as background data and never as executable system instructions.

## Structured Output Validation

All AI analysis responses are parsed and validated using `zod` (`LearningAnalysisSchema`). Responses that fail schema validation are safely rejected.
