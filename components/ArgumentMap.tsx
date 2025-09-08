
import React, { useState } from 'react';
import type { Argument, ArgumentMap as ArgumentMapType } from '../types';

interface ArgumentNodeProps {
  argument: Argument;
  onHighlight: (evidence: string | null) => void;
}

const ArgumentNode: React.FC<ArgumentNodeProps> = ({ argument, onHighlight }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <li className="pl-4 border-l-4 border-indigo-400/30">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left font-semibold text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors"
        aria-expanded={isExpanded}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        {argument.point}
      </button>

      <div className={`pl-6 overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`} aria-hidden={!isExpanded}>
        <div className="pt-1 space-y-3">
            {argument.supportingEvidence.length > 0 && (
                <div>
                  <h5 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Supporting Evidence:</h5>
                  <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
                    {argument.supportingEvidence.map((evidence, i) => (
                      <li 
                        key={i} 
                        onMouseEnter={() => onHighlight(evidence)}
                        onMouseLeave={() => onHighlight(null)}
                        className="p-1 rounded cursor-pointer hover:bg-brand-primary/10 transition-colors duration-200"
                        title="Hover to highlight in original text"
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
      </div>
    </li>
  );
};

interface InteractiveArgumentMapProps {
  argumentMap: ArgumentMapType;
  onHighlight: (evidence: string | null) => void;
}

export const InteractiveArgumentMap: React.FC<InteractiveArgumentMapProps> = ({ argumentMap, onHighlight }) => {
  return (
    <div className="bg-white/10 dark:bg-slate-900/20 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 shadow-lg rounded-xl p-6 space-y-6 ring-1 ring-inset ring-white/10 dark:ring-slate-700/50">
      <div>
        <h3 className="text-lg font-semibold text-sky-600 dark:text-sky-300 mb-2">Main Thesis</h3>
        <p className="text-slate-700 dark:text-slate-300 pl-4 border-l-4 border-sky-400/30">{argumentMap.mainThesis}</p>
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
