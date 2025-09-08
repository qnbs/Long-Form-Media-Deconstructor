
import React from 'react';

interface SummaryCardProps {
  title: string;
  content: string;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ title, content }) => {
  return (
    <div className="bg-white/10 dark:bg-slate-900/20 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 shadow-lg rounded-xl p-6 h-full ring-1 ring-inset ring-white/10 dark:ring-slate-700/50">
      <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">{title}</h3>
      <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{content}</p>
    </div>
  );
};