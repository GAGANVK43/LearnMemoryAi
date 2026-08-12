'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Brain, RefreshCw } from 'lucide-react';
import { apiFetch } from '@/lib/api-client';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileNav } from '@/components/layout/MobileNav';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/auth/me')
      .then((res) => {
        setUser(res.user || res);
      })
      .catch(() => {
        router.push('/login');
      })
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-gray-400 space-y-3">
        <div className="h-12 w-12 rounded-2xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary-light animate-bounce">
          <Brain className="h-6 w-6" />
        </div>
        <div className="flex items-center gap-2 text-sm font-medium">
          <RefreshCw className="h-4 w-4 animate-spin text-primary-light" />
          <span>Loading LearnMemory AI...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row antialiased">
      {/* Mobile Top Navigation */}
      <MobileNav />

      {/* Desktop Persistent Left Sidebar matching Reference Images */}
      <div className="hidden md:block">
        <Sidebar user={user} />
      </div>

      {/* Main Content Workspace */}
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full min-w-0 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
