'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Brain, Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowRight, BookOpen, Target, BarChart2, CheckSquare } from 'lucide-react';
import { apiFetch } from '@/lib/api-client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center p-4 md:p-8">
      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Column: Brand Hero & Features */}
        <div className="lg:col-span-6 space-y-8 pr-0 lg:pr-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary-light shadow-lg">
              <Brain className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">LearnMemory AI</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              Your AI That <br />
              <span className="bg-gradient-to-r from-primary-light via-primary to-accent-purple bg-clip-text text-transparent">
                Remembers
              </span>{' '}
              What <br /> You{' '}
              <span className="bg-gradient-to-r from-primary-light to-accent-cyan bg-clip-text text-transparent">
                Learn.
              </span>
            </h1>
            <p className="text-sm md:text-base text-gray-400 leading-relaxed max-w-lg">
              LearnMemory AI turns your study sessions into personalized learning memory and teaches you exactly what you need.
            </p>
          </div>

          {/* Feature List */}
          <div className="space-y-4 pt-2">
            <div className="flex items-start gap-3.5">
              <div className="h-9 w-9 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary-light shrink-0 mt-0.5">
                <Brain className="h-4.5 w-4.5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">AI-Powered Memory</h4>
                <p className="text-xs text-gray-400">We understand your learning and remember it.</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="h-9 w-9 rounded-xl bg-accent-purple/15 border border-accent-purple/30 flex items-center justify-center text-accent-purple shrink-0 mt-0.5">
                <Target className="h-4.5 w-4.5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Personalized Teaching</h4>
                <p className="text-xs text-gray-400">We focus on what you know and what you don't.</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="h-9 w-9 rounded-xl bg-accent-cyan/15 border border-accent-cyan/30 flex items-center justify-center text-accent-cyan shrink-0 mt-0.5">
                <BarChart2 className="h-4.5 w-4.5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Track Your Progress</h4>
                <p className="text-xs text-gray-400">Visualize your growth and improvement.</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="h-9 w-9 rounded-xl bg-accent-emerald/15 border border-accent-emerald/30 flex items-center justify-center text-accent-emerald shrink-0 mt-0.5">
                <ShieldCheck className="h-4.5 w-4.5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Private & Secure</h4>
                <p className="text-xs text-gray-400">Your learning data is always private and safe.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Login Card matching Reference Image 1 */}
        <div className="lg:col-span-6">
          <div className="glass-panel p-8 md:p-10 border border-surface-border shadow-2xl space-y-6 bg-surface/90">
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-bold text-white tracking-tight flex items-center justify-center gap-2">
                Welcome Back <span className="text-lg">👋</span>
              </h2>
              <p className="text-xs text-gray-400">Login to continue your learning journey</p>
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-accent-rose/10 border border-accent-rose/30 text-xs text-accent-rose">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300">Email address</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="input-field pl-10"
                  />
                  <Mail className="h-4 w-4 text-gray-500 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="input-field pl-10 pr-10"
                  />
                  <Lock className="h-4 w-4 text-gray-500 absolute left-3.5 top-3.5" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-gray-500 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 text-gray-400 cursor-pointer">
                  <input type="checkbox" className="rounded bg-background border-surface-border text-primary focus:ring-0" />
                  <span>Remember me</span>
                </label>
                <a href="#" className="text-primary-light hover:underline font-medium">Forgot password?</a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3.5 text-sm font-semibold mt-2 shadow-indigo-500/25"
              >
                {loading ? 'Signing in...' : 'Login'}
              </button>
            </form>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-surface-border"></div>
              </div>
              <div className="relative flex justify-center text-[11px] uppercase">
                <span className="bg-surface px-3 text-gray-500 font-semibold tracking-wider">or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button className="btn-secondary py-2.5 text-xs">
                <span className="font-bold text-accent-rose mr-1">G</span> Google
              </button>
              <button className="btn-secondary py-2.5 text-xs">
                <span className="font-bold text-gray-300 mr-1">🐙</span> GitHub
              </button>
            </div>

            <div className="text-center text-xs text-gray-400 pt-2">
              Don't have an account?{' '}
              <Link href="/register" className="text-primary-light font-bold hover:underline">
                Sign up
              </Link>
            </div>

            <div className="flex items-center justify-center gap-2 text-[11px] text-gray-500 pt-2 border-t border-surface-border/50">
              <ShieldCheck className="h-3.5 w-3.5 text-accent-emerald" />
              <span>Your data is encrypted and protected</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
