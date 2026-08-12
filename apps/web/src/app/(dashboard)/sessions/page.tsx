'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  Brain, 
  MoreVertical, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  RefreshCw,
  Code2,
  Terminal,
  Database,
  Globe
} from 'lucide-react';
import { apiFetch } from '@/lib/api-client';
import { EmptyState } from '@/components/ui/EmptyState';

export default function StudySessionsPage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All Sessions');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/study-sessions');
      setSessions(data);
    } catch (err) {
      console.error('Failed to fetch study sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this study session?')) return;
    try {
      await apiFetch(`/study-sessions/${id}`, { method: 'DELETE' });
      setSessions(sessions.filter((s) => s.id !== id));
    } catch (err) {
      console.error('Failed to delete session:', err);
    }
  };

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

  const filteredSessions = sessions.filter((session) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      session.title.toLowerCase().includes(query) ||
      session.subject.toLowerCase().includes(query) ||
      session.content.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header Row matching Reference Image 2 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <BookOpen className="h-7 w-7 text-primary-light" /> Study Sessions
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            All your submitted study materials and AI-extracted memory logs.
          </p>
        </div>

        <Link href="/sessions/new" className="btn-primary text-xs font-semibold py-2.5 px-4 self-start md:self-auto">
          <Plus className="h-4 w-4 stroke-[2.5]" />
          New Study Session
        </Link>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search sessions by title, subject or topic..."
            className="input-field pl-10"
          />
          <Search className="h-4 w-4 text-gray-500 absolute left-3.5 top-3.5" />
        </div>
        <button className="btn-secondary py-3 px-4 text-xs font-semibold">
          <Filter className="h-4 w-4 text-gray-400" />
          Filter
        </button>
      </div>

      {/* Filter Tabs matching Reference Image 2 */}
      <div className="flex items-center gap-2 border-b border-surface-border pb-3">
        {['All Sessions', 'Today', 'This Week', 'This Month'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === tab
                ? 'bg-primary/20 text-white border border-primary/40'
                : 'text-gray-400 hover:text-white hover:bg-surface-hover'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Session Cards List */}
      {loading ? (
        <div className="py-20 text-center text-gray-400 flex items-center justify-center gap-3">
          <RefreshCw className="h-6 w-6 animate-spin text-primary-light" />
          <span className="text-sm font-medium">Loading study sessions...</span>
        </div>
      ) : filteredSessions.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No study sessions yet"
          description="Start your first session and Gemini AI will begin building your personal learning memory bank."
          actionHref="/sessions/new"
          actionLabel="+ Create Study Session"
        />
      ) : (
        <div className="space-y-4">
          {filteredSessions.map((session) => {
            const Icon = getSubjectIcon(session.subject);
            const colorClass = getSubjectIconColor(session.subject);
            const memoryCount = session.memories?.length || 0;
            const dateStr = new Date(session.createdAt).toLocaleDateString('en-US', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            });

            return (
              <div
                key={session.id}
                className="glass-card p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 group relative"
              >
                <Link href={`/sessions/${session.id}`} className="flex items-start gap-4 flex-1 min-w-0">
                  <div className={`h-12 w-12 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 ${colorClass}`}>
                    <Icon className="h-6 w-6" />
                  </div>

                  <div className="space-y-1 min-w-0">
                    <h3 className="text-base font-bold text-white group-hover:text-primary-light transition-colors truncate">
                      {session.title}
                    </h3>
                    <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                      {session.content}
                    </p>
                    <div className="pt-1 flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-primary/15 text-primary-light border border-primary/30 uppercase tracking-wider">
                        {session.subject}
                      </span>
                    </div>
                  </div>
                </Link>

                <div className="flex items-center justify-between md:justify-end gap-6 text-xs text-gray-400 shrink-0 border-t md:border-t-0 border-surface-border/50 pt-3 md:pt-0">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-gray-500" />
                    <span>{dateStr}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Brain className="h-3.5 w-3.5 text-primary-light" />
                    <span className="font-semibold text-gray-200">{memoryCount} Memories</span>
                  </div>

                  <div className="relative">
                    <button
                      onClick={() => setActiveMenuId(activeMenuId === session.id ? null : session.id)}
                      className="p-1.5 rounded-lg hover:bg-surface-hover text-gray-400 hover:text-white transition-all"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>

                    {activeMenuId === session.id && (
                      <div className="absolute right-0 top-full mt-1 w-36 p-1 rounded-xl bg-surface border border-surface-border shadow-2xl z-50">
                        <Link
                          href={`/sessions/${session.id}`}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-300 hover:text-white hover:bg-surface-hover rounded-lg"
                        >
                          <BookOpen className="h-3.5 w-3.5" /> View Details
                        </Link>
                        <button
                          onClick={() => handleDelete(session.id)}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-accent-rose hover:bg-accent-rose/10 rounded-lg text-left"
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Pagination Controls matching Reference Image 2 */}
          <div className="flex items-center justify-between pt-4 text-xs text-gray-400">
            <span>Showing 1 to {filteredSessions.length} of {filteredSessions.length} sessions</span>
            <div className="flex items-center gap-1">
              <button disabled className="p-2 rounded-lg bg-surface border border-surface-border text-gray-600 disabled:opacity-50">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button className="h-8 w-8 rounded-lg bg-primary text-white font-bold flex items-center justify-center text-xs">
                1
              </button>
              <button disabled className="p-2 rounded-lg bg-surface border border-surface-border text-gray-600 disabled:opacity-50">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
