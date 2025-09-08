import React from 'react';

interface SummaryCardProps {
  title: string;
  content: string;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ title, content }) => {
  return (
    <div className="bg-slate-200 dark:bg-slate-800 p-6 rounded-lg shadow-lg h-full">
      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-3">{title}</h3>
      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{content}</p>
    </div>
  );
};