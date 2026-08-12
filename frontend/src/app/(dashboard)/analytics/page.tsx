'use client';

import { BarChart3 } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <BarChart3 className="h-7 w-7 text-primary-light" /> Learning Analytics
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Deep analytics and growth tracking for your learning trajectory.
        </p>
      </div>

      <EmptyState
        icon={BarChart3}
        title="Learning Trajectory Analytics"
        description="Comprehensive reports on memory retention rates, topic mastery speed, and weekly study streaks."
        actionHref="/dashboard"
        actionLabel="View Dashboard Overview →"
      />
    </div>
  );
}
