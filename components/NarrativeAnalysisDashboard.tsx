
import React from 'react';
import type { NarrativeAnalysisResult } from '../types';
import { ChatInterface } from './ChatInterface';
import { DashboardHeader } from './DashboardHeader';
import { ChatIcon, ThemeIcon, PlotIcon, CharactersIcon } from './IconComponents';
import { useAppContext } from './AppContext';

interface NarrativeAnalysisDashboardProps {
  result: NarrativeAnalysisResult;
  fileName: string;
}

export const NarrativeAnalysisDashboard: React.FC<NarrativeAnalysisDashboardProps> = ({ result, fileName }) => {
  const { resetAnalysis } = useAppContext();
  
  return (
    <div className="w-full animate-fade-in">
        <DashboardHeader
            fileName={fileName}
            analysisType="narrative"
            onReset={resetAnalysis}
            analysisResult={result}
        />

      <div className="space-y-8 mt-8">
        <section className="bg-slate-200 dark:bg-slate-800 p-6 rounded-lg shadow-lg">
          <div className="flex items-center gap-3 mb-4 text-brand-primary">
            <PlotIcon />
            <h2 className="text-2xl font-semibold">Plot Summary</h2>
          </div>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{result.plotSummary}</p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <section>
                <div className="flex items-center gap-3 mb-4 text-brand-primary">
                    <CharactersIcon />
                    <h2 className="text-2xl font-semibold">Character Profiles</h2>
                </div>
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                    {result.characters.map((char, index) => (
                        <div key={index} className="bg-slate-200/70 dark:bg-slate-800/70 p-4 rounded-lg border border-slate-300 dark:border-slate-700">
                            <h3 className="font-bold text-slate-800 dark:text-slate-200 text-lg">{char.name}</h3>
                            <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">{char.description}</p>
                        </div>
                    ))}
                </div>
            </section>
            
            <section>
                <div className="flex items-center gap-3 mb-4 text-brand-primary">
                    <ThemeIcon />
                    <h2 className="text-2xl font-semibold">Thematic Analysis</h2>
                </div>
                 <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                    {result.themes.map((theme, index) => (
                         <div key={index} className="bg-slate-200/70 dark:bg-slate-800/70 p-4 rounded-lg border border-slate-300 dark:border-slate-700">
                            <h3 className="font-bold text-slate-800 dark:text-slate-200 text-lg">{theme.title}</h3>
                            <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">{theme.explanation}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
        
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
