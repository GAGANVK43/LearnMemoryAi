'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Brain, 
  LayoutDashboard, 
  BookOpen, 
  Sparkles, 
  ClipboardList, 
  RotateCcw, 
  BarChart3, 
  Settings, 
  Plus, 
  LogOut,
  ChevronDown
} from 'lucide-react';
import { useState } from 'react';
import { apiFetch } from '@/lib/api-client';

interface SidebarProps {
  user?: {
    name: string;
    email: string;
  } | null;
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);

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

  const handleLogout = async () => {
    try {
      await apiFetch('/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      router.push('/login');
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <aside className="w-64 bg-sidebar border-r border-surface-border flex flex-col justify-between shrink-0 min-h-screen select-none">
      <div className="p-5 space-y-6">
        {/* Brand Header */}
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="h-9 w-9 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary-light group-hover:scale-105 transition-all">
            <Brain className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold text-white tracking-tight">
            LearnMemory <span className="text-primary-light font-extrabold">AI</span>
          </span>
        </Link>

        {/* Primary Action Button */}
        <Link
          href="/sessions/new"
          className="btn-primary w-full py-3 text-sm font-semibold tracking-wide shadow-indigo-500/20"
        >
          <Plus className="h-4 w-4 stroke-[2.5]" />
          New Study Session
        </Link>

        {/* Navigation Menu */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-primary/15 text-white border border-primary/30 font-semibold shadow-inner'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-surface-hover/60'
                }`}
              >
                <Icon className={`h-4.5 w-4.5 ${isActive ? 'text-primary-light' : 'text-gray-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Profile Menu at Bottom */}
      <div className="p-4 border-t border-surface-border relative">
        <button
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-surface-hover transition-all text-left group"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-9 w-9 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center shrink-0 border border-primary-light/30">
              {getInitials(user?.name)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-white truncate">{user?.name || 'Loading user...'}</div>
              <div className="text-[11px] text-gray-400 truncate">{user?.email || 'user@learnmemory.ai'}</div>
            </div>
          </div>
          <ChevronDown className={`h-4 w-4 text-gray-400 group-hover:text-white transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
        </button>

        {/* User Dropdown Menu */}
        {showUserMenu && (
          <div className="absolute bottom-full left-4 right-4 mb-2 p-1.5 rounded-xl bg-surface border border-surface-border shadow-2xl space-y-1 animate-fade-in z-50">
            <Link
              href="/settings"
              onClick={() => setShowUserMenu(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-gray-300 hover:text-white hover:bg-surface-hover transition-all"
            >
              <Settings className="h-3.5 w-3.5" />
              Account Settings
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-accent-rose hover:bg-accent-rose/10 transition-all text-left"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign Out
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
