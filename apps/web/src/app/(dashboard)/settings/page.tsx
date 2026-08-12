'use client';

import { useState, useEffect } from 'react';
import { Settings, User, ShieldCheck, Cpu, Trash2, CheckCircle2, RefreshCw } from 'lucide-react';
import { apiFetch } from '@/lib/api-client';

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [aiHealth, setAiHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [meData, healthData] = await Promise.all([
          apiFetch('/auth/me').catch(() => null),
          apiFetch('/ai/health').catch(() => null),
        ]);
        setUser(meData);
        setAiHealth(healthData);
      } catch (err) {
        console.error('Failed to load settings data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-fade-in">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <Settings className="h-7 w-7 text-primary-light" /> Settings & Privacy
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Manage your account profile, AI configuration, and personal learning memory privacy.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-gray-400 flex items-center justify-center gap-3">
          <RefreshCw className="h-6 w-6 animate-spin text-primary-light" />
          <span className="text-sm font-medium">Loading account settings...</span>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Section 1: Profile Information */}
          <div className="glass-panel p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-surface-border pb-3 text-white font-bold text-base">
              <User className="h-4.5 w-4.5 text-primary-light" /> Account Profile
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-gray-400">Full Name</label>
                <div className="p-3 rounded-xl bg-background border border-surface-border text-white font-semibold">
                  {user?.name || 'Learner'}
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-400">Email Address</label>
                <div className="p-3 rounded-xl bg-background border border-surface-border text-white font-semibold">
                  {user?.email || 'user@learnmemory.ai'}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: AI Engine Status */}
          <div className="glass-panel p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <Cpu className="h-4.5 w-4.5 text-accent-cyan" /> AI Engine Configuration
              </div>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-accent-emerald/15 text-accent-emerald border border-accent-emerald/30 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> Active
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-background border border-surface-border space-y-1">
                <span className="text-[10px] text-gray-500 uppercase font-bold">AI PROVIDER</span>
                <div className="text-sm font-bold text-white uppercase">{aiHealth?.provider || 'GEMINI'}</div>
              </div>

              <div className="p-4 rounded-xl bg-background border border-surface-border space-y-1">
                <span className="text-[10px] text-gray-500 uppercase font-bold">ACTIVE MODEL</span>
                <div className="text-sm font-bold text-primary-light">{aiHealth?.model || 'gemini-3.6-flash'}</div>
              </div>

              <div className="p-4 rounded-xl bg-background border border-surface-border space-y-1">
                <span className="text-[10px] text-gray-500 uppercase font-bold">CONFIGURED KEY</span>
                <div className="text-sm font-bold text-accent-emerald">
                  {aiHealth?.configured ? 'Yes (Server Secured)' : 'Pending Key'}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Data & Privacy Controls */}
          <div className="glass-panel p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-surface-border pb-3 text-white font-bold text-base">
              <ShieldCheck className="h-4.5 w-4.5 text-accent-emerald" /> Data & Memory Privacy
            </div>

            <p className="text-xs text-gray-400 leading-relaxed">
              Your study notes and learning memories are strictly isolated to your user account (`userId`). No unauthorized user or external system can view your private memory bank.
            </p>

            <div className="pt-2 flex items-center justify-between border-t border-surface-border/50 text-xs">
              <div>
                <div className="font-bold text-white">Reset Account Learning Memory</div>
                <p className="text-gray-500 text-[11px]">Permanently clear your study sessions and knowledge graph.</p>
              </div>

              <button
                onClick={() => alert('Account memory reset is protected. Contact support or clear sessions individually.')}
                className="btn-secondary py-2 px-3 text-xs text-accent-rose hover:bg-accent-rose/10 border-accent-rose/30 font-semibold"
              >
                <Trash2 className="h-3.5 w-3.5" /> Clear Memory
              </button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
