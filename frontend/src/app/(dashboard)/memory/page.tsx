'use client';

import { useState, useEffect } from 'react';
import { 
  Brain, 
  Search, 
  Sparkles, 
  ChevronRight, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle2,
  BookOpen,
  Filter,
  Layers,
  HelpCircle
} from 'lucide-react';
import { apiFetch } from '@/lib/api-client';

export default function MemoryPage() {
  const [memories, setMemories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'graph' | 'topics' | 'concepts' | 'weak'>('graph');

  // Ask My Memory state
  const [question, setQuestion] = useState('');
  const [asking, setAsking] = useState(false);
  const [askResult, setAskResult] = useState<any>(null);

  const fetchMemories = async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/memories');
      setMemories(data);
    } catch (err) {
      console.error('Failed to fetch memories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemories();
  }, []);

  const handleAskMemory = async (e?: React.FormEvent, customQ?: string) => {
    if (e) e.preventDefault();
    const queryToAsk = customQ || question;
    if (!queryToAsk.trim()) return;

    setAsking(true);
    setAskResult(null);

    try {
      const res = await apiFetch('/memories/ask', {
        method: 'POST',
        body: JSON.stringify({ question: queryToAsk }),
      });
      setAskResult(res);
    } catch (err: any) {
      setAskResult({
        answer: "I couldn't find that in your learning memory.",
        memoriesFound: 0,
      });
    } finally {
      setAsking(false);
    }
  };

  // Group memories by Subject -> Topic
  const grouped: Record<string, Record<string, any[]>> = {};
  memories.forEach((mem) => {
    const sub = mem.subject || 'General';
    const top = mem.topic || 'Core';
    if (!grouped[sub]) grouped[sub] = {};
    if (!grouped[sub][top]) grouped[sub][top] = [];
    grouped[sub][top].push(mem);
  });

  const weakMemories = memories.filter((m) => m.isWeakArea || m.understandingLevel === 'WEAK');

  const sampleQuestions = [
    'What did I learn today?',
    'What did I learn about Java?',
    'When did I study binary search?',
    'What concepts am I weak at?',
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <Brain className="h-7 w-7 text-primary-light" /> My Learning Memory
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Your personalized knowledge base built from your study sessions.
        </p>
      </div>

      {/* Ask My Memory Interactive Section */}
      <div className="glass-panel p-6 md:p-8 border-l-4 border-l-accent-cyan space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-accent-cyan/15 border border-accent-cyan/30 flex items-center justify-center text-accent-cyan">
            <Search className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Ask My Memory</h2>
            <p className="text-xs text-gray-400">
              Query your personal learning history. Answers are generated strictly from your stored memories.
            </p>
          </div>
        </div>

        <form onSubmit={(e) => handleAskMemory(e)} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g. What did I learn about Java OOP? or What concepts am I weak at?"
            className="input-field flex-1"
          />
          <button
            type="submit"
            disabled={asking}
            className="btn-primary py-3 px-6 text-xs font-bold bg-accent-cyan hover:bg-accent-cyan/80 text-background shadow-cyan-500/20 disabled:opacity-50"
          >
            {asking ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            Ask Memory
          </button>
        </form>

        {/* Sample Query Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mr-1">Sample Queries:</span>
          {sampleQuestions.map((q) => (
            <button
              key={q}
              onClick={() => {
                setQuestion(q);
                handleAskMemory(undefined, q);
              }}
              className="text-xs bg-surface border border-surface-border hover:border-accent-cyan/50 text-gray-300 hover:text-white px-3 py-1.5 rounded-lg transition-all"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Ask Result Box */}
        {askResult && (
          <div className="mt-4 p-5 rounded-xl bg-surface/90 border border-accent-cyan/40 space-y-2.5 animate-fade-in">
            <div className="flex items-center justify-between text-xs font-bold text-accent-cyan uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-4 w-4" /> Gemini Memory Retrieval Result
              </span>
              <span>{askResult.memoriesFound ?? 0} Memory Items Retrieved</span>
            </div>
            <p className="text-sm text-gray-100 leading-relaxed whitespace-pre-wrap font-sans">
              {askResult.answer}
            </p>
          </div>
        )}
      </div>

      {/* Navigation View Tabs */}
      <div className="flex items-center gap-2 border-b border-surface-border pb-3">
        {[
          { id: 'graph', label: 'Knowledge Graph', icon: Layers },
          { id: 'topics', label: 'Topics', icon: BookOpen },
          { id: 'concepts', label: 'Concepts', icon: Brain },
          { id: 'weak', label: `Weak Areas (${weakMemories.length})`, icon: AlertTriangle },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-primary/20 text-white border border-primary/40 shadow-inner'
                  : 'text-gray-400 hover:text-white hover:bg-surface-hover'
              }`}
            >
              <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-primary-light' : 'text-gray-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Memory View Content */}
      {loading ? (
        <div className="py-20 text-center text-gray-400 flex items-center justify-center gap-3">
          <RefreshCw className="h-6 w-6 animate-spin text-primary-light" />
          <span className="text-sm font-medium">Loading knowledge graph...</span>
        </div>
      ) : Object.keys(grouped).length === 0 ? (
        <div className="glass-panel p-12 text-center text-gray-400 space-y-3">
          <Brain className="h-12 w-12 text-gray-600 mx-auto" />
          <div className="text-lg font-bold text-white">Your Knowledge Graph is Empty</div>
          <p className="text-sm max-w-md mx-auto">
            Submit a study session to begin storing your personal learning memories and constructing your knowledge graph.
          </p>
        </div>
      ) : activeTab === 'weak' ? (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-accent-rose" /> Identified Weak Areas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {weakMemories.map((m) => (
              <div key={m.id} className="glass-card p-4 space-y-2 border-l-2 border-l-accent-rose">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">{m.concept}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-accent-rose/15 text-accent-rose border border-accent-rose/30">
                    WEAK
                  </span>
                </div>
                <p className="text-xs text-gray-400 line-clamp-3">{m.summary || m.explanation}</p>
                <div className="pt-2 text-[10px] text-gray-500">Subject: {m.subject} • Topic: {m.topic}</div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Default Knowledge Graph / Tree View */
        <div className="space-y-6">
          {Object.entries(grouped).map(([subject, topics]) => (
            <div key={subject} className="glass-panel p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-surface-border pb-3">
                <span className="text-xs font-extrabold px-3 py-1 rounded-md bg-primary/15 text-primary-light border border-primary/30 uppercase tracking-widest">
                  Subject: {subject}
                </span>
                <span className="text-xs text-gray-400">{Object.keys(topics).length} Topics</span>
              </div>

              <div className="space-y-4 pl-2">
                {Object.entries(topics).map(([topic, mems]) => (
                  <div key={topic} className="space-y-3">
                    <div className="text-sm font-bold text-white flex items-center gap-2">
                      <ChevronRight className="h-4 w-4 text-accent-cyan" /> Topic: {topic}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pl-6">
                      {mems.map((m) => {
                        const isWeak = m.isWeakArea || m.understandingLevel === 'WEAK';
                        return (
                          <div key={m.id} className="glass-card p-4 space-y-2.5 border-l-2 border-l-primary">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-white text-sm truncate">{m.concept}</span>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  isWeak
                                    ? 'bg-accent-rose/15 text-accent-rose border border-accent-rose/30'
                                    : 'bg-accent-emerald/15 text-accent-emerald border border-accent-emerald/30'
                                }`}
                              >
                                {m.understandingLevel || 'STRONG'}
                              </span>
                            </div>
                            <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed">
                              {m.summary || m.explanation}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
