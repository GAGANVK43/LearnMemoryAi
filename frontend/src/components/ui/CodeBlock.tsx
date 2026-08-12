'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
  language?: string;
  code: string;
}

export function CodeBlock({ language = 'java', code }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-3 rounded-xl bg-background border border-surface-border overflow-hidden text-xs font-mono shadow-xl">
      <div className="flex items-center justify-between px-4 py-2 bg-surface-card border-b border-surface-border text-gray-400">
        <span className="text-[11px] font-semibold tracking-wide uppercase">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface hover:bg-surface-hover border border-surface-border text-gray-300 hover:text-white transition-all text-[11px]"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-accent-emerald" /> Copied!
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" /> Copy
            </>
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-gray-200 leading-relaxed font-mono">
        <code>{code}</code>
      </pre>
    </div>
  );
}
