'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Brain, Mail, Lock, User, Eye, EyeOff, ShieldCheck } from 'lucide-react';
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

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center p-4 md:p-8">
      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Column: Brand & Value */}
        <div className="lg:col-span-6 space-y-6 pr-0 lg:pr-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary-light shadow-lg">
              <Brain className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">LearnMemory AI</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            Start Building Your <br />
            <span className="bg-gradient-to-r from-primary-light via-primary to-accent-cyan bg-clip-text text-transparent">
              Personal Memory
            </span>{' '}
            Bank.
          </h1>
          <p className="text-sm text-gray-400 leading-relaxed max-w-lg">
            Create an account to begin storing your study materials, building your knowledge graph, and unlocking personalized AI tutoring.
          </p>
        </div>

        {/* Right Column: Register Card */}
        <div className="lg:col-span-6">
          <div className="glass-panel p-8 md:p-10 border border-surface-border shadow-2xl space-y-6 bg-surface/90">
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-bold text-white tracking-tight">
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
                    placeholder="Create a password"
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
