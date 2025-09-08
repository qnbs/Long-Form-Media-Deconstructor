

import React from 'react';
import type { GlossaryItem } from '../types';

interface GlossaryListProps {
  glossary: GlossaryItem[];
}

export const GlossaryList: React.FC<GlossaryListProps> = ({ glossary }) => {
  return (
    <div className="bg-white/10 dark:bg-slate-900/20 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 shadow-lg rounded-xl p-6 ring-1 ring-inset ring-white/10 dark:ring-slate-700/50">
      <dl className="space-y-4 max-h-[400px] overflow-y-auto">
        {glossary.map((item, index) => (
          <div key={index}>
            <dt className="font-semibold text-slate-900 dark:text-slate-100">{item.term}</dt>
            <dd className="text-slate-700 dark:text-slate-300 pl-4 border-l-2 border-slate-400/50 dark:border-slate-600/50 mt-1">{item.definition}</dd>
          </div>
        ))}
         {glossary.length === 0 && <p className="text-slate-500 dark:text-slate-400">No key concepts were identified in this document.</p>}
      </dl>
    </div>
  );
};