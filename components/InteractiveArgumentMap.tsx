
import React, { useState } from 'react';
import type { Argument, ArgumentMap as ArgumentMapType } from '../types';

interface ArgumentNodeProps {
  argument: Argument;
  onHighlight: (evidence: string | null) => void;
}

const ArgumentNode: React.FC<ArgumentNodeProps> = ({ argument, onHighlight }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <li className="pl-4 border-l-4 border-indigo-400">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left font-semibold text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors"
      >
        <svg xmlns="http://www.w.org/2000/svg" className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        {argument.point}
      </button>

      {isExpanded && (
        <div className="pl-6 space-y-3 animate-fade-in-fast">
          {argument.supportingEvidence.length > 0 && (
            <div>
              <h5 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Supporting Evidence:</h5>
              <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
                {argument.supportingEvidence.map((evidence, i) => (
                  <li 
                    key={i} 
                    onMouseEnter={() => onHighlight(evidence)}
                    onMouseLeave={() => onHighlight(null)}
                    className="p-1 rounded cursor-pointer hover:bg-slate-300/50 dark:hover:bg-slate-700/50"
                  >
                    {evidence}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {argument.counterArguments && argument.counterArguments.length > 0 && (
            <div>
              <h5 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1 mt-3">Acknowledged Counter-Arguments:</h5>
              <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
                {argument.counterArguments.map((counter, i) => (
                  <li key={i}>{counter}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </li>
  );
};

interface InteractiveArgumentMapProps {
  argumentMap: ArgumentMapType;
  onHighlight: (evidence: string | null) => void;
}

export const InteractiveArgumentMap: React.FC<InteractiveArgumentMapProps> = ({ argumentMap, onHighlight }) => {
  return (
    <div className="bg-white/20 dark:bg-slate-900/30 backdrop-blur-xl border border-white/30 dark:border-slate-700/50 shadow-lg rounded-xl p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-sky-600 dark:text-sky-300 mb-2">Main Thesis</h3>
        <p className="text-slate-700 dark:text-slate-300 pl-4 border-l-4 border-sky-400">{argumentMap.mainThesis}</p>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-300 mb-4">Primary Arguments</h3>
        <ul className="space-y-6">
          {argumentMap.primaryArguments.map((arg, index) => (
            <ArgumentNode key={index} argument={arg} onHighlight={onHighlight} />
          ))}
        </ul>
      </div>
    </div>
  );
};