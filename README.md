# LearnMemory AI — Execution Steps

Follow these step-by-step instructions to set up, configure, and run LearnMemory AI locally.

---

## 1. Prerequisites

Ensure you have the following installed on your machine:

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Git**

---

## 2. Installation & Setup

### Step 1: Clone the Repository
```bash
git clone https://github.com/GAGANVK43/LearnMemoryAi.git
cd LearnMemoryAi
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables
Create a `.env` file in the root directory (or copy from `.env.example`):

```env
# Application Environment
NODE_ENV="development"
PORT=4000
WEB_URL="http://localhost:3000"
API_URL="http://localhost:4000/api"

# Database Configuration (Zero-setup Local SQLite)
DATABASE_URL="file:./dev.db"

# Authentication Security
JWT_SECRET="your_jwt_secret_key"
JWT_EXPIRES_IN="7d"
COOKIE_SECRET="your_cookie_secret_key"

# Gemini AI Provider Configuration
AI_PROVIDER="gemini"
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
GEMINI_MODEL="gemini-flash-latest"
```

---

## 3. Database Setup

Initialize the SQLite database using Prisma:

```bash
# Push Prisma schema to SQLite dev database
npx prisma db push --schema=apps/api/prisma/schema.prisma

# Generate Prisma Client
npx prisma generate --schema=apps/api/prisma/schema.prisma
```

---

## 4. Execution Steps

### Step 1: Build the Backend API
```bash
npm run build --workspace=apps/api
```

### Step 2: Start the Backend API Server (Port 4000)
```bash
npm run start:prod --workspace=apps/api
```

### Step 3: Start the Web Frontend Dev Server (Port 3000)
Open a second terminal window and run:

```bash
npm run dev --workspace=apps/web
```

---

## 5. Verify & Access

- **Web Application Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:4000/api](http://localhost:4000/api)
- **AI Health Check Endpoint**: [http://localhost:4000/api/ai/health](http://localhost:4000/api/ai/health)
