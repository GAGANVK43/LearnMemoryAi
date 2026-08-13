'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ClipboardList, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  RefreshCw, 
  ArrowRight,
  Brain,
  AlertTriangle,
  Trophy
} from 'lucide-react';
import { apiFetch } from '@/lib/api-client';

export default function QuizPage() {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('MEDIUM');
  const [generating, setGenerating] = useState(false);
  const [evaluating, setEvaluating] = useState(false);

  const [quizData, setQuizData] = useState<any>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [evalResult, setEvalResult] = useState<any>(null);

  // Load recent weak areas/memories to prepopulate topic dropdown or suggestions
  const [topics, setTopics] = useState<string[]>([]);

  useEffect(() => {
    async function loadTopics() {
      try {
        const stats = await apiFetch('/stats/dashboard').catch(() => null);
        if (stats?.weakAreas) {
          const list = stats.weakAreas.map((w: any) => w.conceptName);
          setTopics(list);
          if (list.length > 0) setTopic(list[0]);
        }
      } catch (err) {
        console.error('Failed to load quiz topics:', err);
      }
    }
    loadTopics();
  }, []);

  const handleGenerateQuiz = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setGenerating(true);
    setQuizData(null);
    setEvalResult(null);
    setUserAnswers({});

    try {
      const data = await apiFetch('/quiz/generate', {
        method: 'POST',
        body: JSON.stringify({
          topic: topic.trim() || undefined,
          difficulty,
        }),
      });
      setQuizData(data);
    } catch (err: any) {
      console.error('Quiz generation failed:', err);
      alert(err.message || 'Failed to generate quiz with Gemini AI. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleSelectOption = (questionId: string, optionText: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionText,
    }));
  };

  const handleSubmitQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizData) return;

    setEvaluating(true);
    try {
      const result = await apiFetch('/quiz/evaluate', {
        method: 'POST',
        body: JSON.stringify({
          quizId: quizData.quizId,
          userAnswers,
        }),
      });
      setEvalResult(result);
    } catch (err: any) {
      console.error('Quiz evaluation failed:', err);
      alert(err.message || 'Failed to evaluate quiz.');
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <ClipboardList className="h-7 w-7 text-primary-light" /> AI Interactive Quizzes
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Auto-generate personalized multiple-choice quizzes from your study sessions and weak areas.
        </p>
      </div>

      {/* Quiz Generation Form / Header Control */}
      {!quizData && !evalResult && (
        <div className="glass-panel p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-surface-border pb-4">
            <div className="h-10 w-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary-light">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Generate Custom Quiz</h2>
              <p className="text-xs text-gray-400">Gemini AI will craft questions based on your stored memory bank.</p>
            </div>
          </div>

          <form onSubmit={handleGenerateQuiz} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-300">Target Topic or Concept (Optional)</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Java OOP, Polymorphism, Binary Search Tree"
                className="input-field"
              />
              {topics.length > 0 && (
                <div className="flex items-center gap-2 pt-1 flex-wrap">
                  <span className="text-[11px] font-bold text-gray-500 uppercase">Suggested Weak Areas:</span>
                  {topics.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTopic(t)}
                      className="text-xs bg-surface border border-surface-border hover:border-primary/40 text-gray-300 px-2.5 py-1 rounded-lg transition-all"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-300">Difficulty Level</label>
              <div className="grid grid-cols-3 gap-3">
                {['EASY', 'MEDIUM', 'HARD'].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setDifficulty(level)}
                    className={`py-3 rounded-xl text-xs font-bold transition-all border ${
                      difficulty === level
                        ? 'bg-primary/20 text-white border-primary/50 shadow-md'
                        : 'bg-surface-card border-surface-border text-gray-400 hover:text-white'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={generating}
              className="btn-primary w-full py-4 text-sm font-bold shadow-indigo-500/25 flex items-center justify-center gap-2"
            >
              {generating ? (
                <>
                  <RefreshCw className="h-5 w-5 animate-spin text-white" />
                  Generating Custom Quiz with Gemini AI...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  Generate Quiz Now
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* Active Quiz Form */}
      {quizData && !evalResult && (
        <form onSubmit={handleSubmitQuiz} className="space-y-6">
          <div className="flex items-center justify-between glass-panel p-4 px-6">
            <div>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-primary/15 text-primary-light border border-primary/30 uppercase">
                {quizData.subject} • {quizData.difficulty}
              </span>
              <h2 className="text-lg font-bold text-white mt-1">Topic: {quizData.topic}</h2>
            </div>
            <button
              type="button"
              onClick={() => setQuizData(null)}
              className="text-xs text-gray-400 hover:text-white underline"
            >
              Cancel Quiz
            </button>
          </div>

          <div className="space-y-6">
            {quizData.questions.map((q: any, idx: number) => (
              <div key={q.id} className="glass-panel p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <span className="h-7 w-7 rounded-xl bg-primary/20 border border-primary/40 text-primary-light text-xs font-extrabold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <h3 className="text-sm font-bold text-white leading-relaxed pt-0.5">{q.questionText}</h3>
                </div>

                <div className="grid grid-cols-1 gap-2.5 pl-10">
                  {q.options.map((opt: string) => {
                    const isSelected = userAnswers[q.id] === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleSelectOption(q.id, opt)}
                        className={`p-3.5 rounded-xl text-left text-xs font-semibold border transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-primary/20 text-white border-primary/60 shadow-md'
                            : 'bg-surface border border-surface-border text-gray-300 hover:bg-surface-hover'
                        }`}
                      >
                        <span>{opt}</span>
                        <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-primary-light bg-primary' : 'border-gray-600'
                        }`}>
                          {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={evaluating || Object.keys(userAnswers).length === 0}
            className="btn-primary w-full py-4 text-sm font-bold shadow-indigo-500/25 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {evaluating ? (
              <>
                <RefreshCw className="h-5 w-5 animate-spin" />
                Evaluating Answers & Updating Learning Memory...
              </>
            ) : (
              'Submit Quiz Answers'
            )}
          </button>
        </form>
      )}

      {/* Quiz Evaluation Result Screen */}
      {evalResult && (
        <div className="space-y-6 animate-fade-in">
          <div className="glass-panel p-8 text-center space-y-4 border-l-4 border-l-primary">
            <div className="h-16 w-16 rounded-2xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary-light mx-auto">
              <Trophy className="h-8 w-8" />
            </div>

            <div>
              <div className="text-3xl font-black text-white">{evalResult.score.toFixed(0)}%</div>
              <p className="text-sm font-bold text-gray-300 mt-1">{evalResult.feedback}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                Correct: {evalResult.correctCount} / {evalResult.totalQuestions} Questions
              </p>
            </div>

            <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => {
                  setEvalResult(null);
                  setQuizData(null);
                }}
                className="btn-primary py-2.5 px-5 text-xs font-bold"
              >
                Take Another Quiz
              </button>
              <Link
                href={`/tutor?q=Teach me about ${quizData?.topic || 'my weak areas'}`}
                className="btn-secondary py-2.5 px-5 text-xs font-bold text-primary-light flex items-center gap-2"
              >
                Review in AI Tutor <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Detailed Question Review */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white">Answer Breakdown</h3>
            {evalResult.evalResults.map((r: any, idx: number) => (
              <div
                key={idx}
                className={`glass-card p-5 space-y-2.5 border-l-4 ${
                  r.isCorrect ? 'border-l-accent-emerald bg-accent-emerald/5' : 'border-l-accent-rose bg-accent-rose/5'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="text-sm font-bold text-white">{r.questionText}</span>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    r.isCorrect
                      ? 'bg-accent-emerald/20 text-accent-emerald border border-accent-emerald/30'
                      : 'bg-accent-rose/20 text-accent-rose border border-accent-rose/30'
                  }`}>
                    {r.isCorrect ? 'CORRECT' : 'INCORRECT'}
                  </span>
                </div>

                <div className="text-xs text-gray-300 space-y-1 pt-1">
                  <div>Your Answer: <span className="font-semibold text-white">{r.userAnswer || 'No answer'}</span></div>
                  {!r.isCorrect && (
                    <div>Correct Answer: <span className="font-semibold text-accent-emerald">{r.correctAnswer}</span></div>
                  )}
                  {r.explanation && <p className="text-[11px] text-gray-400 pt-1 italic">{r.explanation}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
