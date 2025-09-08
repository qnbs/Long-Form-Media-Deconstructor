

import React from 'react';
import type { FactCheckResult } from '../types';
import { LinkIcon } from './IconComponents';

interface FactCheckCardProps {
  result: FactCheckResult;
}

export const FactCheckCard: React.FC<FactCheckCardProps> = ({ result }) => {
  return (
    <div className="bg-white/10 dark:bg-slate-900/20 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 p-4 rounded-lg ring-1 ring-inset ring-white/10 dark:ring-slate-700/50">
      <blockquote className="border-l-4 border-amber-400 pl-4 mb-4">
        <p className="font-semibold text-slate-800 dark:text-slate-100">Claim: "{result.claim}"</p>
      </blockquote>
      
      <div className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap mb-4">
        <h4 className="font-semibold text-sky-600 dark:text-sky-300 mb-1">Verification:</h4>
        <p>{result.verification}</p>
      </div>

      {result.sources && result.sources.length > 0 && (
        <div>
          <h4 className="font-semibold text-sky-600 dark:text-sky-300 mb-2">Sources:</h4>
          <ul className="space-y-2">
            {result.sources.map((source, index) => (
              <li key={index}>
                <a
                  href={source.web.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-brand-primary hover:underline transition-colors duration-200"
                >
                  <LinkIcon />
                  <span className="truncate">{source.web.title || source.web.uri}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};