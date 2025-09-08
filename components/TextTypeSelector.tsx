
import React from 'react';
import { DocumentIcon, MicroscopeIcon, FeatherIcon } from './IconComponents';

interface TextTypeSelectorProps {
  onSelect: (type: 'publication' | 'narrative') => void;
  onCancel: () => void;
}

export const TextTypeSelector: React.FC<TextTypeSelectorProps> = ({ onSelect, onCancel }) => {
  return (
    <div className="w-full max-w-lg text-center bg-slate-200 dark:bg-slate-800 p-8 rounded-xl shadow-2xl animate-fade-in">
      <div className="flex justify-center items-center gap-3 mb-4">
        <DocumentIcon />
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Select Document Type</h2>
      </div>
      <p className="text-slate-500 dark:text-slate-400 mb-8">
        To provide the most accurate analysis, please specify the type of text document you've uploaded.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={() => onSelect('publication')}
          className="flex flex-col items-center justify-center w-full px-6 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
        >
          <MicroscopeIcon />
          <span className="mt-2">Scientific Publication</span>
          <span className="block text-xs text-indigo-200 mt-1 font-normal">e.g., academic paper, research article</span>
        </button>
        <button
          onClick={() => onSelect('narrative')}
          className="flex flex-col items-center justify-center w-full px-6 py-4 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
        >
            <FeatherIcon />
          <span className="mt-2">Narrative Work</span>
          <span className="block text-xs text-sky-200 mt-1 font-normal">e.g., story, news article, script</span>
        </button>
      </div>
       <button
          onClick={onCancel}
          className="mt-8 text-sm text-slate-500 hover:text-slate-300 transition-colors"
        >
          Cancel
        </button>
    </div>
  );
};