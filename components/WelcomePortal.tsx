import React from 'react';
import { BrainCircuitIcon } from './IconComponents';

interface WelcomePortalProps {
  onEnterApp: () => void;
}

export const WelcomePortal: React.FC<WelcomePortalProps> = ({ onEnterApp }) => {
  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 bg-slate-800/30 rounded-xl shadow-2xl border border-slate-700 animate-fade-in">
        <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-2">
                <BrainCircuitIcon />
                <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-500">
                    Welcome to the Deconstructor
                </h1>
            </div>
            <p className="text-lg text-slate-400 max-w-3xl mx-auto">
                An AI-powered cognitive partner for deep content intelligence. Deconstruct long-form media into structured, queryable knowledge.
            </p>
        </div>

        <div className="mb-12">
            <h2 className="text-2xl font-bold text-center text-slate-200 mb-8">How It Works: A Quick Tour</h2>
            <div className="relative pl-8 border-l-2 border-slate-700 space-y-12">
                <div className="relative">
                     <div className="absolute -left-[41px] top-1 w-5 h-5 bg-slate-700 rounded-full border-4 border-slate-900 flex items-center justify-center font-mono text-xs text-brand-primary">1</div>
                     <h3 className="text-xl font-semibold text-brand-primary mb-3">Choose Your Scope & Depth</h3>
                     <p className="text-slate-300 mb-4">Start by selecting your analysis type. Use <strong className="text-slate-100">Single Source</strong> for one file or URL, or <strong className="text-slate-100">Archival Collection</strong> to find connections across multiple files. Then, choose <strong className="text-slate-100">Standard</strong> for deep analysis or <strong className="text-slate-100">Express</strong> for a faster overview.</p>
                </div>
                 <div className="relative">
                     <div className="absolute -left-[41px] top-1 w-5 h-5 bg-slate-700 rounded-full border-4 border-slate-900 flex items-center justify-center font-mono text-xs text-brand-primary">2</div>
                     <h3 className="text-xl font-semibold text-brand-primary mb-3">Provide Your Content</h3>
                     <p className="text-slate-300 mb-4">Drag and drop your files or paste a URL. The app supports a wide variety of formats:</p>
                     <ul className="flex flex-wrap gap-2 text-xs">
                        <li className="bg-slate-700 px-2 py-1 rounded">.txt files</li>
                        <li className="bg-slate-700 px-2 py-1 rounded">Audio (mp3, wav)</li>
                        <li className="bg-slate-700 px-2 py-1 rounded">Video (mp4, mov)</li>
                        <li className="bg-slate-700 px-2 py-1 rounded">Images (jpg, png)</li>
                     </ul>
                </div>
                <div className="relative">
                     <div className="absolute -left-[41px] top-1 w-5 h-5 bg-slate-700 rounded-full border-4 border-slate-900 flex items-center justify-center font-mono text-xs text-brand-primary">3</div>
                     <h3 className="text-xl font-semibold text-brand-primary mb-3">Explore Interactive Dashboards</h3>
                     <p className="text-slate-300 mb-4">Once the AI completes its analysis, you get a custom dashboard tailored to your content. Explore argument maps for publications, interactive timelines for videos, knowledge graphs for archives, and more.</p>
                </div>
                 <div className="relative">
                     <div className="absolute -left-[41px] top-1 w-5 h-5 bg-slate-700 rounded-full border-4 border-slate-900 flex items-center justify-center font-mono text-xs text-brand-primary">4</div>
                     <h3 className="text-xl font-semibold text-brand-primary mb-3">Ask Questions with AI Chat</h3>
                     <p className="text-slate-300 mb-4">Every dashboard includes a conversational AI. Ask follow-up questions in natural language to dive deeper into the analysis, clarify points, or request summaries of specific sections.</p>
                </div>
            </div>
        </div>

        <div className="text-center">
            <button
                onClick={onEnterApp}
                className="px-10 py-4 bg-brand-primary hover:bg-sky-600 text-white font-bold text-lg rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
            >
                Start Analyzing
            </button>
        </div>
    </div>
  );
};
