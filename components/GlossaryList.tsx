import React from 'react';
import type { GlossaryItem } from '../types';

interface GlossaryListProps {
  glossary: GlossaryItem[];
}

export const GlossaryList: React.FC<GlossaryListProps> = ({ glossary }) => {
  return (
    <div className="bg-slate-200/50 dark:bg-slate-800/50 p-6 rounded-lg shadow-inner">
      <dl className="space-y-4 max-h-[400px] overflow-y-auto">
        {glossary.map((item, index) => (
          <div key={index}>
            <dt className="font-semibold text-slate-800 dark:text-slate-200">{item.term}</dt>
            <dd className="text-slate-600 dark:text-slate-300 pl-4 border-l-2 border-slate-400 dark:border-slate-600 mt-1">{item.definition}</dd>
          </div>
        ))}
         {glossary.length === 0 && <p className="text-slate-500 dark:text-slate-400">No key concepts were identified in this document.</p>}
      </dl>
    </div>
  );
};