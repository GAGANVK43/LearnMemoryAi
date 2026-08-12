'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, BookOpen, Calendar, Brain, Trash2, RefreshCw, AlertTriangle, Lightbulb } from 'lucide-react';
import { apiFetch } from '@/lib/api-client';

export default function SessionDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSession() {
      if (!id) return;
      setLoading(true);
      try {
        const data = await apiFetch(`/study-sessions/${id}`);
        setSession(data);
      } catch (err) {
        console.error('Failed to load study session details:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSession();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this study session?')) return;
    try {
      await apiFetch(`/study-sessions/${id}`, { method: 'DELETE' });
      router.push('/sessions');
    } catch (err) {
      console.error('Failed to delete session:', err);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-gray-400 flex items-center justify-center gap-3">
        <RefreshCw className="h-6 w-6 animate-spin text-primary-light" />
        <span className="text-sm font-medium">Loading session details...</span>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="py-20 text-center text-gray-400 space-y-4">
        <BookOpen className="h-12 w-12 text-gray-600 mx-auto" />
        <h2 className="text-xl font-bold text-white">Study Session Not Found</h2>
        <Link href="/sessions" className="btn-primary inline-flex text-xs py-2 px-4">
          Back to Study Sessions
        </Link>
      </div>
    );
  }

  const dateStr = new Date(session.createdAt).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-surface-border">
        <div className="flex items-center gap-3">
          <Link
            href="/sessions"
            className="p-2 rounded-xl bg-surface border border-surface-border text-gray-400 hover:text-white hover:bg-surface-hover transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-primary/15 text-primary-light border border-primary/30 uppercase tracking-wider">
              {session.subject}
            </span>
            <h1 className="text-2xl font-extrabold text-white tracking-tight mt-1">{session.title}</h1>
          </div>
        </div>

        <button
          onClick={handleDelete}
          className="p-2.5 rounded-xl bg-accent-rose/10 border border-accent-rose/30 text-accent-rose hover:bg-accent-rose/20 transition-all text-xs font-semibold flex items-center gap-2"
        >
          <Trash2 className="h-4 w-4" /> Delete Session
        </button>
      </div>

      <div className="flex items-center gap-6 text-xs text-gray-400">
        <div className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 text-gray-500" />
          <span>Recorded on {dateStr}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Brain className="h-3.5 w-3.5 text-primary-light" />
          <span>{session.memories?.length || 0} Learning Memories Extracted</span>
        </div>
      </div>

      {/* Main Study Content Card */}
      <div className="glass-panel p-6 space-y-3">
        <h2 className="text-sm font-bold text-gray-300 uppercase tracking-wider">Original Study Content</h2>
        <div className="p-4 rounded-xl bg-background border border-surface-border text-sm text-gray-200 leading-relaxed font-sans whitespace-pre-wrap">
          {session.content}
        </div>
      </div>

      {/* AI Extracted Memories */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary-light" /> AI Extracted Knowledge Cards
        </h2>

        {session.memories?.length === 0 ? (
          <p className="text-xs text-gray-400">No memories associated with this session.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {session.memories?.map((mem: any) => (
              <div key={mem.id} className="glass-card p-5 space-y-3 border-l-4 border-l-primary">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">{mem.concept}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    mem.isWeakArea || mem.understandingLevel === 'WEAK'
                      ? 'bg-accent-rose/15 text-accent-rose border border-accent-rose/30'
                      : 'bg-accent-emerald/15 text-accent-emerald border border-accent-emerald/30'
                  }`}>
                    {mem.understandingLevel}
                  </span>
                </div>

                <p className="text-xs text-gray-300 leading-relaxed">{mem.summary || mem.explanation}</p>

                <div className="pt-2 border-t border-surface-border/50 text-[11px] text-gray-400 flex items-center justify-between">
                  <span>Topic: {mem.topic}</span>
                  <span>Confidence: {(mem.confidence * 100).toFixed(0)}%</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
