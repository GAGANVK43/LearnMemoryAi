# 🧪 Gemini AI Manual Integration Verification Guide

This guide walks through testing LearnMemory AI with a real Google Gemini API key.

## 1. Environment Setup

Open `.env` in the project root and add your Gemini API key:

```env
AI_PROVIDER="gemini"
GEMINI_MODEL="gemini-3.6-flash"
GEMINI_API_KEY="AIzaSyYourActualGeminiApiKeyHere"
```

> ⚠️ **Security Notice**: Never commit `.env` or share your `GEMINI_API_KEY`.

---

## 2. Start Application

Rebuild & run NestJS backend and Next.js frontend:

```bash
# Terminal 1: API Backend
npm run start:dev --workspace=apps/api

# Terminal 2: Web App
npm run dev --workspace=apps/web
```

Verify AI Health Endpoint:
```bash
curl http://localhost:4000/api/ai/health
```
Expected output:
```json
{
  "provider": "gemini",
  "configured": true,
  "model": "gemini-3.6-flash",
  "status": "active",
  "timestamp": "..."
}
```

---

## 3. End-to-End User Verification Journey

1. Open `http://localhost:3000/login` and log in with `demo@learnmemory.ai` (Password: `password123`).
2. Click **New Study Session**.
3. Submit Title: *"Binary Search Pointers"*, Subject: *"DSA"*, Content:
   *"Today I studied Binary Search. I understand the basic O(log n) concept, but I am very confused about pointer boundary updates (when to do left = mid + 1 vs right = mid)."*
4. **Verification**: Gemini analyzes the study session, extracts `Binary Search` concept with `WEAK` understanding level, and creates a `WeakArea` entry for pointer boundary updates.
5. Open **My Learning Memory** (`http://localhost:3000/memory`).
6. Type query into **Ask My Memory**: *"What did I learn about binary search?"*.
7. **Verification**: Gemini retrieves stored memory and provides an answer grounded strictly in your study history.
8. Open **AI Tutor** (`http://localhost:3000/tutor`).
9. Type: *"Teach me binary search."*
10. **Verification**: Gemini Tutor acknowledges your previous knowledge and targets pointer boundary updates first!
