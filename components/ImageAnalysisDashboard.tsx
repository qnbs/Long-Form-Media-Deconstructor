
import React, { useState } from 'react';
import type { ImageAnalysisResult } from '../types';
import { ChatInterface } from './ChatInterface';
import { DashboardHeader } from './DashboardHeader';
import { ChatIcon, CopyIcon, DescriptionIcon, ObjectsIcon, OcrIcon } from './IconComponents';
import { useAppContext } from './AppContext';

interface ImageAnalysisDashboardProps {
    result: ImageAnalysisResult;
    fileName: string;
}

export const ImageAnalysisDashboard: React.FC<ImageAnalysisDashboardProps> = ({ result, fileName }) => {
    const { resetAnalysis } = useAppContext();
    const chatContext = JSON.stringify(result, null, 2);
    const [copyNotification, setCopyNotification] = useState('');

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopyNotification('Copied!');
        setTimeout(() => setCopyNotification(''), 2000);
    };

    return (
        <div className="w-full animate-fade-in max-w-7xl">
            <DashboardHeader
                fileName={fileName}
                analysisType="image"
                onReset={resetAnalysis}
                analysisResult={result}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                <div className="space-y-8">
                    <section className="bg-white/10 dark:bg-slate-900/20 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 shadow-lg rounded-xl p-6 ring-1 ring-inset ring-white/10 dark:ring-slate-700/50">
                        <div className="flex items-center gap-3 mb-4 text-brand-primary">
                            <DescriptionIcon />
                            <h2 className="text-2xl font-semibold">AI Description</h2>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{result.description}</p>
                    </section>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {result.identifiedObjects.length > 0 && (
                             <section className="bg-white/10 dark:bg-slate-900/20 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 shadow-lg rounded-xl p-6 ring-1 ring-inset ring-white/10 dark:ring-slate-700/50">
                                <div className="flex items-center gap-3 mb-4 text-brand-primary">
                                    <ObjectsIcon />
                                    <h2 className="text-xl font-semibold">Identified Objects</h2>
                                </div>
                                <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-1">
                                    {result.identifiedObjects.map((obj, i) => <li key={i}>{obj}</li>)}
                                </ul>
                            </section>
                        )}
                       
                        {result.extractedText && (
                            <section className="relative bg-white/10 dark:bg-slate-900/20 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 shadow-lg rounded-xl p-6 ring-1 ring-inset ring-white/10 dark:ring-slate-700/50">
                                {copyNotification && <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-xs px-2 py-1 rounded shadow-lg animate-fade-in-fast z-20">{copyNotification}</div>}
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3 text-brand-primary">
                                        <OcrIcon />
                                        <h2 className="text-xl font-semibold">Extracted Text</h2>
                                    </div>
                                    <button onClick={() => handleCopy(result.extractedText!)} className="p-1.5 bg-white/20 dark:bg-slate-800/40 rounded-full text-slate-600 dark:text-slate-300 hover:bg-white/40 dark:hover:bg-slate-700/50 transition-colors" title="Copy extracted text" aria-label="Copy extracted text">
                                        <CopyIcon />
                                    </button>
                                </div>
                                <pre className="bg-white/10 dark:bg-slate-800/40 p-3 rounded-md text-slate-700 dark:text-slate-200 whitespace-pre-wrap font-mono text-sm">
                                    <code>{result.extractedText}</code>
                                </pre>
                            </section>
                        )}
                    </div>
                </div>

                <aside>
                    <div className="sticky top-24">
                         <img src={result.imageUrl} alt={fileName} className="w-full rounded-lg shadow-xl object-contain max-h-[70vh]" />
                    </div>
                </aside>
            </div>
            
            <section className="mt-8">
                <div className="flex items-center gap-3 mb-4 text-brand-primary">
                    <ChatIcon />
                    <h2 className="text-2xl font-semibold">Conversational Query</h2>
                </div>
                <ChatInterface documentContext={chatContext} contextType="analysis" />
            </section>
        </div>
    );
};