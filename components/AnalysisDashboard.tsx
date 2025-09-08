
import React, { useState } from 'react';
import type { PublicationAnalysisResult } from '../types';
import { InteractiveArgumentMap } from './ArgumentMap';
import { SummaryCard } from './SummaryCard';
import { GlossaryList } from './GlossaryList';
import { ChatInterface } from './ChatInterface';
import { DashboardHeader } from './DashboardHeader';
import { ChatIcon, CopyIcon, SummaryIcon, GraphIcon, TextContextIcon, GlossaryIcon } from './IconComponents';
import { useAppContext } from './AppContext';

interface AnalysisDashboardProps {
    result: PublicationAnalysisResult;
    fileName: string;
}

const SourceTextViewer: React.FC<{ text: string; highlightedEvidence: string | null }> = ({ text, highlightedEvidence }) => {
    const [copyNotification, setCopyNotification] = useState('');

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopyNotification('Copied!');
        setTimeout(() => setCopyNotification(''), 2000);
    };

    const renderText = () => {
        if (!highlightedEvidence) {
            return <p>{text}</p>;
        }
        const parts = text.split(new RegExp(`(${highlightedEvidence.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
        return (
            <p>
                {parts.map((part, i) =>
                    part.toLowerCase() === highlightedEvidence.toLowerCase() ? (
                        <mark key={i} className="bg-amber-400/50 text-slate-900 dark:text-slate-100 rounded px-1 transition-all duration-300">
                            {part}
                        </mark>
                    ) : (
                        part
                    )
                )}
            </p>
        );
    };

    return (
        <div className="relative bg-white/10 dark:bg-slate-900/20 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 shadow-lg rounded-xl h-full ring-1 ring-inset ring-white/10 dark:ring-slate-700/50">
             <div className="sticky top-0 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm py-2 -mt-6 -mx-6 px-6 z-10 rounded-t-xl border-b border-white/30 dark:border-slate-700/50">
                <div className="flex justify-between items-center mb-0 mt-4">
                    <div className="flex items-center gap-3 text-brand-primary">
                        <TextContextIcon />
                        <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">Original Text</h2>
                    </div>
                    <button onClick={handleCopy} className="p-1.5 bg-white/20 dark:bg-slate-700/50 rounded-full text-slate-600 dark:text-slate-300 hover:bg-white/40 dark:hover:bg-slate-600/50 transition-colors" title="Copy original text" aria-label="Copy original text">
                      <CopyIcon />
                    </button>
                </div>
            </div>
            <div className="p-6 h-full max-h-[calc(720px-4rem)] overflow-y-auto">
                <div className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {renderText()}
                </div>
            </div>
            {copyNotification && <div className="absolute top-4 right-4 bg-emerald-500 text-white text-xs px-2 py-1 rounded shadow-lg animate-fade-in-fast z-20">{copyNotification}</div>}
        </div>
    );
};


export const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ result, fileName }) => {
  const [highlightedEvidence, setHighlightedEvidence] = useState<string | null>(null);
  const { resetAnalysis } = useAppContext();

  const handleHighlight = (evidence: string | null) => {
    setHighlightedEvidence(evidence);
  };
  
  return (
    <div className="w-full animate-fade-in">
        <DashboardHeader
            fileName={fileName}
            analysisType="publication"
            onReset={resetAnalysis}
            analysisResult={result}
        />

      <div className="space-y-8 mt-8">
        <section>
          <div className="flex items-center gap-3 mb-4 text-brand-primary">
            <SummaryIcon />
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">Structured Summary</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SummaryCard title="Thesis" content={result.summary.thesis} />
            <SummaryCard title="Methodology" content={result.summary.methodology} />
            <SummaryCard title="Results" content={result.summary.results} />
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <section>
                <div className="flex items-center gap-3 mb-4 text-brand-primary">
                    <GraphIcon />
                    <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">Interactive Argument Map</h2>
                </div>
                <InteractiveArgumentMap argumentMap={result.argumentMap} onHighlight={handleHighlight} />
            </section>
            
            <section>
                <SourceTextViewer text={result.originalText} highlightedEvidence={highlightedEvidence} />
            </section>
        </div>

         <section>
            <div className="flex items-center gap-3 mb-4 text-brand-primary">
                <GlossaryIcon />
                <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">Key Concepts Glossary</h2>
            </div>
            <GlossaryList glossary={result.glossary} />
        </section>
        
        <section>
            <div className="flex items-center gap-3 mb-4 text-brand-primary">
                <ChatIcon />
                <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">Conversational Query</h2>
            </div>
            <ChatInterface documentContext={result.originalText} contextType="document" />
        </section>
      </div>
    </div>
  );
};
