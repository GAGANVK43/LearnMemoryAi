import Link from 'next/link';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionHref,
  actionLabel,
}: EmptyStateProps) {
  return (
    <div className="glass-panel p-12 text-center text-gray-400 space-y-4 max-w-xl mx-auto my-8">
      <div className="h-16 w-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary-light mx-auto shadow-inner">
        <Icon className="h-8 w-8" />
      </div>
      <div className="space-y-1">
        <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
        <p className="text-sm text-gray-400 max-w-md mx-auto leading-relaxed">{description}</p>
      </div>
      {actionHref && actionLabel && (
        <div className="pt-2">
          <Link href={actionHref} className="btn-primary inline-flex py-3 px-6 text-sm font-semibold">
            {actionLabel}
          </Link>
        </div>
      )}
    </div>
  );
}
