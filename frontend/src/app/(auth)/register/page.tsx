'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Brain, User, Mail, Lock, Eye, EyeOff, ShieldCheck, Target, BarChart2 } from 'lucide-react';
import { apiFetch } from '@/lib/api-client';

export default function RegisterPage() {
  const [name, setName] = useState('');
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
      await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      });
      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = (provider: string) => {
    alert(`${provider} OAuth 2.0 requires GOOGLE_CLIENT_ID and GITHUB_CLIENT_ID configured in .env. Enter your Name, Email & Password below to sign up instantly!`);
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
              Start Building Your <br />
              <span className="bg-gradient-to-r from-primary-light via-primary to-accent-purple bg-clip-text text-transparent">
                Personal Memory
              </span> <br /> Bank.
            </h1>
            <p className="text-sm md:text-base text-gray-400 leading-relaxed max-w-lg">
              Create an account to begin storing your study materials, building your knowledge graph, and unlocking personalized AI tutoring.
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

        {/* Right Column: Register Card */}
        <div className="lg:col-span-6">
          <div className="glass-panel p-8 md:p-10 border border-surface-border shadow-2xl space-y-6 bg-surface/90">
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-bold text-white tracking-tight flex items-center justify-center gap-2">
                Create Account <span className="text-lg">🚀</span>
              </h2>
              <p className="text-xs text-gray-400">Join LearnMemory AI today</p>
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-accent-rose/10 border border-accent-rose/30 text-xs text-accent-rose">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300">Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="input-field pl-10"
                  />
                  <User className="h-4 w-4 text-gray-500 absolute left-3.5 top-3.5" />
                </div>
              </div>

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
                    placeholder="Create a strong password"
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

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3.5 text-sm font-semibold mt-2 shadow-indigo-500/25"
              >
                {loading ? 'Creating Account...' : 'Get Started'}
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
              <button
                type="button"
                onClick={() => handleOAuth('Google')}
                className="btn-secondary py-2.5 text-xs hover:border-primary/40"
              >
                <span className="font-bold text-accent-rose mr-1">G</span> Google
              </button>
              <button
                type="button"
                onClick={() => handleOAuth('GitHub')}
                className="btn-secondary py-2.5 text-xs hover:border-primary/40"
              >
                <span className="font-bold text-gray-300 mr-1">🐙</span> GitHub
              </button>
            </div>

            <div className="text-center text-xs text-gray-400 pt-2">
              Already have an account?{' '}
              <Link href="/login" className="text-primary-light font-bold hover:underline">
                Sign in
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
