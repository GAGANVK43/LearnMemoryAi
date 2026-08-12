'use client';

import Link from 'next/link';
import { Search, Sparkles, Plus } from 'lucide-react';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showActions?: boolean;
}

export function Header({ title, subtitle, showActions = true }: HeaderProps) {
  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-surface-border/60">
      <div>
        {title && (
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            {title}
          </h1>
        )}
        {subtitle && (
          <p className="text-xs md:text-sm text-gray-400 mt-1 font-normal">
            {subtitle}
          </p>
        )}
      </div>

      {showActions && (
        <div className="flex items-center gap-2.5 flex-wrap">
          <Link
            href="/sessions/new"
            className="btn-primary py-2.5 px-4 text-xs font-semibold"
          >
            <Plus className="h-4 w-4" />
            New Session
          </Link>
          <Link
            href="/memory"
            className="btn-secondary py-2.5 px-3.5 text-xs font-medium"
          >
            <Search className="h-3.5 w-3.5 text-accent-cyan" />
            Ask My Memory
          </Link>
          <Link
            href="/tutor"
            className="btn-secondary py-2.5 px-3.5 text-xs font-medium"
          >
            <Sparkles className="h-3.5 w-3.5 text-primary-light" />
            AI Tutor
          </Link>
        </div>
      )}
    </header>
  );
}
