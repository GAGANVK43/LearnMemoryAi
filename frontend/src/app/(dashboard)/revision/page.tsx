'use client';

import { RotateCcw } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';

export default function RevisionPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <RotateCcw className="h-7 w-7 text-primary-light" /> Spaced Revision
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Review concepts right before you forget them using spaced repetition memory science.
        </p>
      </div>

      <EmptyState
        icon={RotateCcw}
        title="Spaced Revision System"
        description="Your stored concepts will automatically surface here on optimal review intervals to guarantee long-term retention."
        actionHref="/tutor?q=Revise my recent topics"
        actionLabel="Revise Now in AI Tutor →"
      />
    </div>
  );
}
