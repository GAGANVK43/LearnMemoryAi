import Link from 'next/link';
import { Brain, Sparkles, BookOpen, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-gray-100 flex flex-col justify-between">
      {/* Navigation */}
      <header className="border-b border-surface-border px-6 py-4 flex items-center justify-between glass-panel sticky top-0 z-50 rounded-none border-x-0 border-t-0">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary-light">
            <Brain className="h-6 w-6" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">LearnMemory AI</span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-medium text-gray-300 hover:text-white transition-colors px-4 py-2"
          >
            Log In
          </Link>
          <Link
            href="/register"
            className="text-sm font-medium bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-lg shadow-lg shadow-primary/25 transition-all flex items-center gap-2"
          >
            Start Learning <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6 py-20 text-center flex-1 flex flex-col justify-center items-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary-light text-sm font-medium mb-8">
          <Sparkles className="h-4 w-4" /> Powered by Personal Structured Memory
        </div>

        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white max-w-4xl leading-tight mb-6">
          Your AI That Remembers <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-light via-indigo-400 to-accent-cyan">What You Learn.</span>
        </h1>

        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-10 leading-relaxed">
          LearnMemory AI turns your study sessions into a personal learning memory and uses that memory to teach you exactly what you need.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <Link
            href="/register"
            className="bg-primary hover:bg-primary-hover text-white text-base font-semibold px-8 py-3.5 rounded-xl shadow-xl shadow-primary/30 transition-all flex items-center justify-center gap-2"
          >
            Start Learning <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            href="/login"
            className="glass-card text-gray-300 hover:text-white text-base font-semibold px-8 py-3.5 rounded-xl transition-all border border-surface-border flex items-center justify-center"
          >
            Sign In to Account
          </Link>
        </div>

        {/* Visual Core Flow Diagram */}
        <div className="w-full max-w-4xl glass-panel p-8 md:p-10 border border-surface-border rounded-2xl">
          <h2 className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-8">
            The Core Learning Engine
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-left">
            <div className="glass-card p-5 border-l-4 border-l-accent-cyan">
              <div className="text-xs font-bold text-accent-cyan mb-1 uppercase tracking-wider">Step 1</div>
              <div className="font-semibold text-white text-lg mb-1 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-accent-cyan" /> LEARN
              </div>
              <p className="text-sm text-gray-400">Provide your raw notes, study sessions, or concepts.</p>
            </div>

            <div className="glass-card p-5 border-l-4 border-l-primary">
              <div className="text-xs font-bold text-primary-light mb-1 uppercase tracking-wider">Step 2</div>
              <div className="font-semibold text-white text-lg mb-1 flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary-light" /> REMEMBER
              </div>
              <p className="text-sm text-gray-400">AI extracts structured memories, tracking weak & strong areas.</p>
            </div>

            <div className="glass-card p-5 border-l-4 border-l-accent-amber">
              <div className="text-xs font-bold text-accent-amber mb-1 uppercase tracking-wider">Step 3</div>
              <div className="font-semibold text-white text-lg mb-1 flex items-center gap-2">
                <Zap className="h-5 w-5 text-accent-amber" /> RETRIEVE
              </div>
              <p className="text-sm text-gray-400">Ask anything you studied. AI searches your private memory.</p>
            </div>

            <div className="glass-card p-5 border-l-4 border-l-accent-emerald">
              <div className="text-xs font-bold text-accent-emerald mb-1 uppercase tracking-wider">Step 4</div>
              <div className="font-semibold text-white text-lg mb-1 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-accent-emerald" /> TEACH
              </div>
              <p className="text-sm text-gray-400">Personal AI tutor teaches based on your knowledge history.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-surface-border py-6 px-6 text-center text-sm text-gray-400 flex flex-col md:flex-row justify-between items-center max-w-6xl mx-auto w-full gap-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-accent-emerald" /> Private & Secure Student Memory
        </div>
        <div>© 2026 LearnMemory AI. All rights reserved.</div>
      </footer>
    </div>
  );
}
