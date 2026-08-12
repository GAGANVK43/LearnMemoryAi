'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Brain, 
  Menu, 
  X, 
  LayoutDashboard, 
  BookOpen, 
  Sparkles, 
  Settings, 
  Plus, 
  ClipboardList, 
  RotateCcw, 
  BarChart3 
} from 'lucide-react';

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Study Sessions', href: '/sessions', icon: BookOpen },
    { label: 'My Learning Memory', href: '/memory', icon: Brain },
    { label: 'AI Tutor', href: '/tutor', icon: Sparkles },
    { label: 'Quizzes', href: '/quizzes', icon: ClipboardList },
    { label: 'Revision', href: '/revision', icon: RotateCcw },
    { label: 'Analytics', href: '/analytics', icon: BarChart3 },
    { label: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <div className="md:hidden bg-sidebar border-b border-surface-border px-4 py-3 flex items-center justify-between sticky top-0 z-50">
      <Link href="/dashboard" className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center text-primary-light">
          <Brain className="h-4 w-4" />
        </div>
        <span className="font-bold text-white text-base">LearnMemory AI</span>
      </Link>

      <div className="flex items-center gap-2">
        <Link href="/sessions/new" className="btn-primary py-1.5 px-3 text-xs">
          <Plus className="h-3.5 w-3.5" /> New
        </Link>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-gray-400 hover:text-white rounded-lg bg-surface border border-surface-border"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-sidebar border-b border-surface-border p-4 space-y-2 shadow-2xl animate-fade-in z-50">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive ? 'bg-primary/20 text-white font-bold' : 'text-gray-400 hover:bg-surface-hover'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
