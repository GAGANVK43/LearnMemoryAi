'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Save, 
  Brain, 
  UploadCloud, 
  FileText, 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  HelpCircle, 
  Sparkles,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  Image as ImageIcon
} from 'lucide-react';
import { apiFetch } from '@/lib/api-client';

export default function NewSessionPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [error, setError] = useState('');
  const [attachedFile, setAttachedFile] = useState<File | null>(null);

  const subjects = [
    'Java Programming',
    'Data Structures & Algorithms',
    'Database Management',
    'Web Development',
    'Operating Systems',
    'Computer Networks',
    'Machine Learning',
    'General Study',
  ];

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !subject || !content) {
      setError('Please fill in all required fields (Title, Subject, Content).');
      return;
    }

    setError('');
    setLoading(true);
    setStatusMessage('Saving session...');

    try {
      setTimeout(() => setStatusMessage('Gemini AI is analyzing your notes...'), 1200);
      setTimeout(() => setStatusMessage('Extracting concepts & weak areas...'), 2500);

      await apiFetch('/study-sessions', {
        method: 'POST',
        body: JSON.stringify({ title, subject, content }),
      });

      router.push('/memory');
    } catch (err: any) {
      setError(err.message || 'Failed to analyze study session. Please try again.');
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachedFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fade-in">
      {/* Top Bar Header matching Reference Image 5 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-border">
        <div className="flex items-center gap-3">
          <Link
            href="/sessions"
            className="p-2 rounded-xl bg-surface border border-surface-border text-gray-400 hover:text-white hover:bg-surface-hover transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">New Study Session</h1>
            <p className="text-xs text-gray-400">Add what you learned and let AI build your memory.</p>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="btn-primary text-xs font-semibold py-2.5 px-6 self-start sm:self-auto shadow-indigo-500/25"
        >
          {loading ? (
            <>
              <Brain className="h-4 w-4 animate-spin text-white" />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>Save Session</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-accent-rose/10 border border-accent-rose/30 text-xs text-accent-rose font-medium">
          {error}
        </div>
      )}

      {loading && (
        <div className="p-6 rounded-2xl bg-surface/90 border border-primary/40 flex items-center justify-center gap-3 text-sm text-primary-light font-semibold animate-pulse">
          <Brain className="h-6 w-6 animate-spin text-primary-light" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* 2-Column Form Layout matching Reference Image 5 */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Form Inputs */}
        <div className="lg:col-span-8 space-y-6">
          <div className="glass-panel p-6 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">
                  Session Title <span className="text-accent-rose">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Java OOP Concepts"
                  className="input-field"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">
                  Subject <span className="text-accent-rose">*</span>
                </label>
                <select
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="input-field bg-background text-white"
                >
                  <option value="">Select a subject</option>
                  {subjects.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Note Editor Area */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-300">
                What did you learn? <span className="text-accent-rose">*</span>
              </label>

              {/* Formatting Toolbar */}
              <div className="rounded-xl border border-surface-border bg-background overflow-hidden">
                <div className="flex items-center gap-1 p-2 bg-surface-card border-b border-surface-border text-gray-400">
                  <button type="button" className="p-1.5 rounded hover:bg-surface text-gray-400 hover:text-white"><Bold className="h-3.5 w-3.5" /></button>
                  <button type="button" className="p-1.5 rounded hover:bg-surface text-gray-400 hover:text-white"><Italic className="h-3.5 w-3.5" /></button>
                  <button type="button" className="p-1.5 rounded hover:bg-surface text-gray-400 hover:text-white"><Underline className="h-3.5 w-3.5" /></button>
                  <div className="h-4 w-px bg-surface-border mx-1" />
                  <button type="button" className="p-1.5 rounded hover:bg-surface text-gray-400 hover:text-white"><List className="h-3.5 w-3.5" /></button>
                  <button type="button" className="p-1.5 rounded hover:bg-surface text-gray-400 hover:text-white"><ListOrdered className="h-3.5 w-3.5" /></button>
                  <div className="h-4 w-px bg-surface-border mx-1" />
                  <button type="button" className="p-1.5 rounded hover:bg-surface text-gray-400 hover:text-white"><Quote className="h-3.5 w-3.5" /></button>
                  <button type="button" className="p-1.5 rounded hover:bg-surface text-gray-400 hover:text-white"><Code className="h-3.5 w-3.5" /></button>
                  <button type="button" className="p-1.5 rounded hover:bg-surface text-gray-400 hover:text-white"><LinkIcon className="h-3.5 w-3.5" /></button>
                  <button type="button" className="p-1.5 rounded hover:bg-surface text-gray-400 hover:text-white"><ImageIcon className="h-3.5 w-3.5" /></button>
                </div>

                <textarea
                  required
                  rows={8}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write or paste what you learned today... You can include notes, questions, key points, code, examples, or anything that helps you remember."
                  className="w-full p-4 bg-transparent text-white placeholder-gray-500 focus:outline-none text-sm leading-relaxed"
                />

                <div className="flex items-center justify-between px-4 py-2 bg-surface-card/50 border-t border-surface-border text-[11px] text-gray-500">
                  <span>Markdown supported</span>
                  <span>{wordCount} words</span>
                </div>
              </div>
            </div>

            {/* File Upload Dropzone */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold text-gray-300">Upload Files (Optional)</label>
              
              <div className="border-2 border-dashed border-surface-border hover:border-primary/50 rounded-2xl p-6 text-center space-y-2 bg-background/50 transition-all cursor-pointer relative">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary-light mx-auto">
                  <UploadCloud className="h-5 w-5" />
                </div>
                <div className="text-xs font-bold text-white">Drag and drop files here, or click to browse</div>
                <p className="text-[11px] text-gray-500">Supports PDF, DOCX, TXT, Images (Max 10MB each)</p>
              </div>

              {attachedFile && (
                <div className="flex items-center justify-between p-3 rounded-xl bg-surface border border-surface-border text-xs text-gray-200">
                  <div className="flex items-center gap-2.5">
                    <FileText className="h-4 w-4 text-primary-light" />
                    <span className="font-semibold">{attachedFile.name}</span>
                    <span className="text-[10px] text-gray-500">({(attachedFile.size / 1024).toFixed(1)} KB)</span>
                  </div>
                  <button type="button" onClick={() => setAttachedFile(null)} className="text-gray-500 hover:text-accent-rose">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-400 pt-2 border-t border-surface-border/50">
              <ShieldCheck className="h-4 w-4 text-accent-emerald shrink-0" />
              <span>Your data is private and secure. Only you can access your learning memory.</span>
            </div>
          </div>
        </div>

        {/* Right Column: Helper Cards matching Reference Image 5 */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Card 1: Tips for better memory */}
          <div className="glass-panel p-6 space-y-4">
            <div className="flex items-center gap-2 text-primary-light">
              <Sparkles className="h-4 w-4" />
              <h3 className="text-sm font-bold text-white">Tips for better memory</h3>
            </div>

            <ul className="space-y-3 text-xs text-gray-400">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-primary-light shrink-0 mt-0.5" />
                <div>
                  <strong className="text-gray-200">Be specific:</strong> Include as many details as you can.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-primary-light shrink-0 mt-0.5" />
                <div>
                  <strong className="text-gray-200">Add your questions:</strong> Mention any doubts or areas that confuse you.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-primary-light shrink-0 mt-0.5" />
                <div>
                  <strong className="text-gray-200">Include examples:</strong> Code snippets, diagrams, or real examples help a lot.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-primary-light shrink-0 mt-0.5" />
                <div>
                  <strong className="text-gray-200">Review later:</strong> AI will identify weak areas and help you improve.
                </div>
              </li>
            </ul>
          </div>

          {/* Card 2: AI will analyze and extract */}
          <div className="glass-panel p-6 space-y-4">
            <h3 className="text-sm font-bold text-white">AI will analyze and extract</h3>

            <ul className="space-y-2.5 text-xs text-gray-400">
              <li className="flex items-center gap-2">
                <span className="text-primary-light">🔑</span> Key concepts & topics
              </li>
              <li className="flex items-center gap-2">
                <span className="text-accent-cyan">📊</span> Understanding level
              </li>
              <li className="flex items-center gap-2">
                <span className="text-accent-amber">⚠️</span> Weak areas & doubts
              </li>
              <li className="flex items-center gap-2">
                <span className="text-accent-rose">❓</span> Questions to revisit
              </li>
              <li className="flex items-center gap-2">
                <span className="text-accent-emerald">📝</span> Summary & examples
              </li>
            </ul>
          </div>

        </div>

      </form>
    </div>
  );
}
