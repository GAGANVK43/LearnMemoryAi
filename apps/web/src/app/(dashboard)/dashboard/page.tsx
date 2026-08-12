'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  Brain, 
  Lightbulb, 
  AlertTriangle, 
  Plus, 
  Search, 
  Sparkles, 
  ArrowRight, 
  Flame, 
  Rocket, 
  Check, 
  ChevronRight,
  RefreshCw,
  Code2,
  Terminal,
  Database,
  Globe
} from 'lucide-react';
import { apiFetch } from '@/lib/api-client';
import { EmptyState } from '@/components/ui/EmptyState';

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [meData, statsData] = await Promise.all([
          apiFetch('/auth/me').catch(() => null),
          apiFetch('/stats/dashboard').catch(() => null),
        ]);
        setUser(meData);
        setStats(statsData);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const getSubjectIcon = (subject?: string) => {
    const s = (subject || '').toLowerCase();
    if (s.includes('java') || s.includes('code') || s.includes('dev')) return Code2;
    if (s.includes('dsa') || s.includes('algo') || s.includes('search')) return Terminal;
    if (s.includes('db') || s.includes('sql') || s.includes('data')) return Database;
    return Globe;
  };

  const getSubjectIconColor = (subject?: string) => {
    const s = (subject || '').toLowerCase();
    if (s.includes('java')) return 'text-primary-light bg-primary/15 border-primary/30';
    if (s.includes('dsa')) return 'text-accent-emerald bg-accent-emerald/15 border-accent-emerald/30';
    if (s.includes('db') || s.includes('sql')) return 'text-accent-amber bg-accent-amber/15 border-accent-amber/30';
    return 'text-accent-cyan bg-accent-cyan/15 border-accent-cyan/30';
  };

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  if (loading) {
    return (
      <div className="py-20 flex items-center justify-center text-gray-400 gap-3">
        <RefreshCw className="h-6 w-6 animate-spin text-primary-light" />
        <span className="text-sm font-medium">Loading your learning memory overview...</span>
      </div>
    );
  }

  const sessionCount = stats?.totalSessions || 0;
  const topicCount = stats?.totalTopics || 0;
  const conceptCount = stats?.totalConcepts || 0;
  const weakCount = stats?.totalWeakAreas || 0;
  const recentMemories = stats?.recentMemories || [];
  const weakAreas = stats?.weakAreas || [];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Header Row matching Reference Image 3 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Welcome back, {user?.name?.split(' ')[0] || 'Learner'}! <span className="text-2xl">👋</span>
          </h1>
          <p className="text-sm text-gray-400 mt-1 font-normal">
            Here is your personal learning memory overview.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Link href="/sessions/new" className="btn-primary text-xs font-semibold py-2.5 px-4">
            <Plus className="h-4 w-4 stroke-[2.5]" />
            New Study Session
          </Link>
          <Link href="/memory" className="btn-secondary text-xs font-medium py-2.5 px-3.5">
            <Search className="h-3.5 w-3.5 text-accent-cyan" />
            Ask My Memory
          </Link>
          <Link href="/tutor" className="btn-secondary text-xs font-medium py-2.5 px-3.5">
            <Sparkles className="h-3.5 w-3.5 text-primary-light" />
            AI Tutor
          </Link>
        </div>
      </div>

      {/* 4 Metric Cards matching Reference Image 3 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Study Sessions */}
        <div className="glass-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary-light">
              <BookOpen className="h-5 w-5" />
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-accent-emerald/15 text-accent-emerald border border-accent-emerald/30">
              ↑ 12% from last week
            </span>
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400">STUDY SESSIONS</div>
            <div className="text-3xl font-black text-white mt-1 tracking-tight">{sessionCount}</div>
          </div>
        </div>

        {/* Card 2: Topics Learned */}
        <div className="glass-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 rounded-xl bg-accent-emerald/15 border border-accent-emerald/30 flex items-center justify-center text-accent-emerald">
              <Brain className="h-5 w-5" />
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-accent-emerald/15 text-accent-emerald border border-accent-emerald/30">
              ↑ 8% from last week
            </span>
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400">TOPICS LEARNED</div>
            <div className="text-3xl font-black text-white mt-1 tracking-tight">{topicCount}</div>
          </div>
        </div>

        {/* Card 3: Concepts Mastered */}
        <div className="glass-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 rounded-xl bg-accent-cyan/15 border border-accent-cyan/30 flex items-center justify-center text-accent-cyan">
              <Lightbulb className="h-5 w-5" />
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-accent-emerald/15 text-accent-emerald border border-accent-emerald/30">
              ↑ 15% from last week
            </span>
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400">CONCEPTS MASTERED</div>
            <div className="text-3xl font-black text-white mt-1 tracking-tight">{conceptCount}</div>
          </div>
        </div>

        {/* Card 4: Weak Areas */}
        <div className="glass-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 rounded-xl bg-accent-rose/15 border border-accent-rose/30 flex items-center justify-center text-accent-rose">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-accent-rose/15 text-accent-rose border border-accent-rose/30">
              ↓ 3% from last week
            </span>
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400">WEAK AREAS</div>
            <div className="text-3xl font-black text-white mt-1 tracking-tight">{weakCount}</div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Section: Recent Learning & Weak Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Recent Learning */}
        <div className="lg:col-span-6 glass-panel p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-surface-border pb-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <BookOpen className="h-4.5 w-4.5 text-primary-light" /> Recent Learning
            </h2>
            <Link href="/sessions" className="text-xs font-semibold text-primary-light hover:underline flex items-center gap-1">
              View All <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {recentMemories.length === 0 ? (
            <div className="py-12 text-center text-gray-400 space-y-3">
              <Brain className="h-10 w-10 text-gray-600 mx-auto" />
              <p className="text-sm font-semibold text-white">No study sessions recorded yet</p>
              <p className="text-xs text-gray-400 max-w-xs mx-auto">
                Submit your first study material and Gemini AI will construct your learning memory.
              </p>
              <Link href="/sessions/new" className="btn-primary inline-flex py-2 px-4 text-xs font-semibold mt-2">
                <Plus className="h-3.5 w-3.5" /> Create First Session
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentMemories.map((mem: any) => {
                const Icon = getSubjectIcon(mem.subject);
                const colorClass = getSubjectIconColor(mem.subject);
                const isWeak = mem.isWeakArea || mem.understandingLevel === 'WEAK';

                return (
                  <div key={mem.id} className="glass-card p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className={`h-10 w-10 rounded-xl border flex items-center justify-center shrink-0 ${colorClass}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-white truncate">{mem.concept || mem.topic}</h4>
                        <p className="text-xs text-gray-400 truncate mt-0.5">
                          {mem.summary || mem.explanation || `${mem.topic} concept`}
                        </p>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-surface border border-surface-border text-gray-400 inline-block mt-1">
                          {mem.subject}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end shrink-0 gap-1">
                      <span className="text-[10px] text-gray-500 font-medium">Recent</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isWeak 
                          ? 'bg-accent-rose/15 text-accent-rose border border-accent-rose/30'
                          : 'bg-accent-emerald/15 text-accent-emerald border border-accent-emerald/30'
                      }`}>
                        {mem.understandingLevel || 'STRONG'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Identified Weak Areas */}
        <div className="lg:col-span-6 glass-panel p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-surface-border pb-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <AlertTriangle className="h-4.5 w-4.5 text-accent-rose" /> Identified Weak Areas
            </h2>
            <Link href="/tutor" className="text-xs font-semibold text-accent-rose hover:underline flex items-center gap-1">
              Ask AI Tutor to Teach <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {weakAreas.length === 0 ? (
            <div className="py-12 text-center text-gray-400 space-y-3">
              <Sparkles className="h-10 w-10 text-accent-emerald/50 mx-auto" />
              <p className="text-sm font-semibold text-white">No weak areas identified!</p>
              <p className="text-xs text-gray-400 max-w-xs mx-auto">
                As you learn, Gemini AI will automatically detect confuse concepts and highlight them here for targeted revision.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {weakAreas.map((weak: any) => (
                <div key={weak.id} className="glass-card p-4 flex items-center justify-between gap-4 border-l-2 border-l-accent-rose">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="h-9 w-9 rounded-xl bg-accent-rose/15 border border-accent-rose/30 flex items-center justify-center text-accent-rose shrink-0">
                      <AlertTriangle className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-white truncate">{weak.conceptName}</h4>
                      <p className="text-xs text-gray-400 truncate mt-0.5">
                        {weak.subject} {weak.topic ? `• ${weak.topic}` : ''}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-accent-rose/15 text-accent-rose border border-accent-rose/30">
                      HIGH
                    </span>
                    <Link
                      href={`/tutor?q=Teach me ${encodeURIComponent(weak.conceptName)}`}
                      className="text-xs font-bold text-primary-light hover:text-white transition-all flex items-center gap-1 bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-lg border border-primary/30"
                    >
                      Target in Tutor →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Bottom Widgets matching Reference Image 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Widget 1: Study Streak */}
        <div className="lg:col-span-5 glass-panel p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-accent-amber animate-pulse" />
            <h3 className="text-base font-bold text-white">Study Streak</h3>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-white tracking-tight">7</span>
            <span className="text-sm font-semibold text-gray-400">days</span>
          </div>
          <p className="text-xs text-gray-400">Keep it up! 🔥</p>

          <div className="grid grid-cols-7 gap-2 pt-2">
            {daysOfWeek.map((day, idx) => (
              <div key={day} className="flex flex-col items-center gap-1.5">
                <span className="text-[11px] text-gray-500 font-medium">{day}</span>
                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-white border text-xs font-bold ${
                  idx < 6
                    ? 'bg-primary border-primary-light/50 shadow-md shadow-indigo-500/20'
                    : 'bg-surface border-surface-border text-gray-600'
                }`}>
                  {idx < 6 ? <Check className="h-4 w-4 stroke-[3]" /> : null}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Widget 2: Learning Progress Rocket */}
        <div className="lg:col-span-7 glass-panel p-6 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Rocket className="h-5 w-5 text-primary-light" />
              <h3 className="text-base font-bold text-white">Learning Progress</h3>
            </div>
            <span className="text-sm font-black text-primary-light">68%</span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-400">
              <span>Overall progress this month</span>
              <span>Target: 100%</span>
            </div>
            <div className="h-3 w-full bg-background rounded-full overflow-hidden border border-surface-border p-0.5">
              <div className="h-full bg-gradient-to-r from-primary to-accent-cyan rounded-full transition-all duration-500" style={{ width: '68%' }} />
            </div>
          </div>

          <p className="text-xs text-gray-400">
            You're doing great! Keep learning consistently to expand your personal AI memory bank.
          </p>
        </div>

      </div>
    </div>
  );
}
