'use client';

import { ClipboardList } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';

export default function QuizzesPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <ClipboardList className="h-7 w-7 text-primary-light" /> AI Quizzes
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Test your knowledge with auto-generated quizzes based on your weak areas.
        </p>
      </div>

      <EmptyState
        icon={ClipboardList}
        title="Interactive Quizzes Coming Soon"
        description="Gemini AI will automatically generate custom multiple-choice & coding quizzes from your stored learning memories."
        actionHref="/tutor?q=Quiz me on my weak areas"
        actionLabel="Try Quiz Me in AI Tutor →"
      />
    </div>
  );
}
