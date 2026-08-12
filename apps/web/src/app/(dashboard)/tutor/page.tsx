'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Sparkles, 
  Send, 
  Brain, 
  BookOpen, 
  Zap, 
  FlaskConical, 
  Lightbulb, 
  HelpCircle, 
  RotateCcw,
  Paperclip,
  Mic,
  History,
  MoreVertical,
  RefreshCw,
  Copy,
  Check
} from 'lucide-react';
import { apiFetch } from '@/lib/api-client';
import { CodeBlock } from '@/components/ui/CodeBlock';

interface Message {
  id: string;
  sender: 'user' | 'tutor';
  content: string;
  timestamp: string;
}

export default function TutorPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [selectedMode, setSelectedMode] = useState('EXPLAIN_SIMPLY');
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const tutorModes = [
    { id: 'EXPLAIN_SIMPLY', label: 'Explain Simply', icon: BookOpen, desc: 'Easy to understand' },
    { id: 'EXPLAIN_DEEPLY', label: 'Explain Deeply', icon: Zap, desc: 'In-depth explanation' },
    { id: 'GIVE_EXAMPLE', label: 'Give Example', icon: FlaskConical, desc: 'Show real-world examples' },
    { id: 'GIVE_HINT', label: 'Give Hint', icon: Lightbulb, desc: 'Helpful hints' },
    { id: 'QUIZ_ME', label: 'Quiz Me', icon: HelpCircle, desc: 'Test my knowledge' },
    { id: 'REVISE', label: 'Revise', icon: RotateCcw, desc: 'Summarize & revise' },
  ];

  useEffect(() => {
    async function loadData() {
      try {
        const [meData, statsData] = await Promise.all([
          apiFetch('/auth/me').catch(() => null),
          apiFetch('/stats/dashboard').catch(() => null),
        ]);
        setUser(meData);
        setStats(statsData);
      } catch (err) {
        console.error('Failed to load user info:', err);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    const currentQuestion = input;
    setInput('');
    setLoading(true);

    try {
      const history = messages.map((m) => ({ sender: m.sender, content: m.content }));
      
      const res = await apiFetch('/tutor/chat', {
        method: 'POST',
        body: JSON.stringify({
          message: currentQuestion,
          prompt: currentQuestion,
          question: currentQuestion,
          conversationHistory: history,
          mode: selectedMode,
        }),
      });

      const tutorResponseText = res.reply || res.response || "I couldn't generate a response right now.";

      const tutorMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'tutor',
        content: tutorResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, tutorMsg]);
    } catch (err: any) {
      console.error('AI Tutor chat error:', err);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'tutor',
        content: err.message || "Sorry, I ran into an error connecting to Gemini AI. Please try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const renderMessageContent = (content: string) => {
    const parts = content.split(/(```[\s\S]*?```)/g);

    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const lines = part.slice(3, -3).trim().split('\n');
        const firstLine = lines[0].trim();
        const hasLang = /^[a-zA-Z0-9_-]+$/.test(firstLine);
        const language = hasLang ? firstLine : 'java';
        const code = hasLang ? lines.slice(1).join('\n') : lines.join('\n');

        return <CodeBlock key={index} language={language} code={code} />;
      }

      return (
        <span key={index} className="whitespace-pre-wrap leading-relaxed">
          {part}
        </span>
      );
    });
  };

  const weakAreasList = stats?.weakAreas?.map((w: any) => w.conceptName).join(', ') || 'None identified yet';

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] max-w-7xl mx-auto space-y-4 animate-fade-in">
      
      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-4 pb-3 border-b border-surface-border shrink-0">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary-light" /> Personal AI Tutor
            </h1>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-primary/20 text-primary-light border border-primary/40 flex items-center gap-1.5 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-accent-emerald animate-pulse" />
              Memory Connected
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Personalized teaching based on your learning history and weak areas.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="btn-secondary py-2 px-3 text-xs font-medium">
            <History className="h-3.5 w-3.5" /> Conversation History
          </button>
          <button className="p-2 rounded-xl bg-surface border border-surface-border text-gray-400 hover:text-white">
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
      </div>



      {/* Main Workspace Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0 overflow-hidden">
        
        {/* Left Column: Tutor Modes Guide */}
        <div className="hidden lg:block lg:col-span-3 glass-panel p-5 space-y-4 overflow-y-auto shrink-0">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Tutor Modes</h3>
          <div className="space-y-3">
            {tutorModes.map((m) => {
              const Icon = m.icon;
              const isActive = selectedMode === m.id;
              return (
                <div
                  key={m.id}
                  onClick={() => setSelectedMode(m.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    isActive
                      ? 'bg-primary/15 border-primary/40 text-white'
                      : 'bg-surface-card border-surface-border text-gray-400 hover:bg-surface-hover'
                  }`}
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-white mb-0.5">
                    <Icon className="h-3.5 w-3.5 text-primary-light" /> {m.label}
                  </div>
                  <p className="text-[11px] text-gray-400">{m.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center Column: Chat Messages Stream */}
        <div className="lg:col-span-9 flex flex-col justify-between glass-panel p-4 md:p-6 overflow-hidden">
          
          {/* Scrollable Messages Area */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            
            {/* Greeting Banner */}
            <div className="glass-card p-5 border-l-4 border-l-primary space-y-2 bg-primary/10">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <Brain className="h-5 w-5 text-primary-light" />
                <span>Hi {user?.name?.split(' ')[0] || 'Learner'}! 👋</span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                I'm your AI Tutor. I use your personal learning memory to teach you better. Ask me any question, review weak areas, or quiz your knowledge!
              </p>
              <div className="text-[11px] font-semibold text-accent-rose pt-1">
                Your weak areas right now: <span className="underline">{weakAreasList}</span>
              </div>
            </div>

            {/* Conversation Messages Stream */}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'tutor' && (
                  <div className="h-9 w-9 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary-light shrink-0 mt-1">
                    <Brain className="h-4.5 w-4.5" />
                  </div>
                )}

                <div
                  className={`max-w-2xl p-4 rounded-2xl text-xs sm:text-sm space-y-2 shadow-lg ${
                    msg.sender === 'user'
                      ? 'bg-primary text-white rounded-tr-none'
                      : 'bg-surface-card border border-surface-border text-gray-200 rounded-tl-none'
                  }`}
                >
                  {renderMessageContent(msg.content)}
                  <div
                    className={`text-[10px] text-right ${
                      msg.sender === 'user' ? 'text-indigo-200' : 'text-gray-500'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 items-center">
                <div className="h-9 w-9 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary-light shrink-0">
                  <Brain className="h-4.5 w-4.5 animate-spin" />
                </div>
                <div className="glass-card p-4 rounded-2xl text-xs text-gray-400 flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 animate-spin text-primary-light" />
                  Gemini AI is analyzing your memory and generating a personalized explanation...
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Bottom Chat Composer */}
          <form onSubmit={handleSend} className="pt-4 border-t border-surface-border flex items-center gap-3 shrink-0">
            <div className="relative flex-1">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything about your learning..."
                className="input-field py-3.5 pr-20"
              />
              <div className="absolute right-3 top-3 flex items-center gap-1 text-gray-500">
                <button type="button" className="p-1 hover:text-white"><Paperclip className="h-4 w-4" /></button>
                <button type="button" className="p-1 hover:text-white"><Mic className="h-4 w-4" /></button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="h-11 w-11 rounded-full bg-primary hover:bg-primary-hover text-white flex items-center justify-center shadow-lg shadow-indigo-500/30 disabled:opacity-50 shrink-0 transition-all active:scale-95"
            >
              <Send className="h-4 w-4 stroke-[2.5]" />
            </button>
          </form>

        </div>

      </div>
    </div>
  );
}
