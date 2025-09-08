
import React, { useState } from 'react';
import type { PublicationAnalysisResult } from '../types';
import { InteractiveArgumentMap } from './InteractiveArgumentMap';
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
                        <mark key={i} className="bg-amber-400/50 text-slate-100 rounded px-1 transition-all duration-300">
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
        <div className="relative bg-slate-200/50 dark:bg-slate-800/50 p-6 rounded-lg shadow-inner h-full max-h-[720px] overflow-y-auto">
             {copyNotification && <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-xs px-2 py-1 rounded shadow-lg animate-fade-in-fast z-20">{copyNotification}</div>}
            <div className="flex justify-between items-center mb-4 sticky top-0 bg-slate-200/80 dark:bg-slate-800/80 backdrop-blur-sm py-2 -mt-6 -mx-6 px-6">
                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">Original Text</h3>
                <button onClick={handleCopy} className="p-1.5 bg-slate-300 dark:bg-slate-700 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-400 dark:hover:bg-slate-600 transition-colors" aria-label="Copy original text">
                  <CopyIcon />
                </button>
            </div>
            <div className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                {renderText()}
            </div>
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
            <h2 className="text-2xl font-semibold">Structured Summary</h2>
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
                    <h2 className="text-2xl font-semibold">Interactive Argument Map</h2>
                </div>
                <InteractiveArgumentMap argumentMap={result.argumentMap} onHighlight={handleHighlight} />
            </section>
            
            <section>
                <div className="flex items-center gap-3 mb-4 text-brand-primary">
                    <TextContextIcon />
                    <h2 className="text-2xl font-semibold">Original Text Context</h2>
                </div>
                <SourceTextViewer text={result.originalText} highlightedEvidence={highlightedEvidence} />
            </section>
        </div>

         <section>
            <div className="flex items-center gap-3 mb-4 text-brand-primary">
                <GlossaryIcon />
                <h2 className="text-2xl font-semibold">Key Concepts Glossary</h2>
            </div>
            <GlossaryList glossary={result.glossary} />
        </section>
        
        <section>
            <div className="flex items-center gap-3 mb-4 text-brand-primary">
                <ChatIcon />
                <h2 className="text-2xl font-semibold">Conversational Query</h2>
            </div>
            <ChatInterface documentContext={result.originalText} contextType="document" />
        </section>
      </div>
    </div>
  );
};
