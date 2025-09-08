
import React from 'react';
import { BrainCircuitIcon, HelpIcon, PlusIcon, SettingsIcon, ArchiveBoxIcon } from './IconComponents';
import { useCommandPalette } from '../hooks/useCommandPalette';

interface HeaderProps {
    onShowHelp: () => void;
    onShowSettings: () => void;
    onShowArchive: () => void;
    onNewAnalysis?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onShowHelp, onShowSettings, onShowArchive, onNewAnalysis }) => {
    const { openPalette } = useCommandPalette();
    
    return (
        <header className="relative text-center w-full max-w-4xl mx-auto">
            <div className="absolute top-0 left-0 flex items-center gap-2">
                {onNewAnalysis && (
                     <button
                        onClick={onNewAnalysis}
                        className="flex items-center gap-2 text-sm bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 px-3 py-2 rounded-lg transition-colors text-slate-700 dark:text-slate-300"
                        aria-label="Start New Analysis"
                    >
                        <PlusIcon />
                        <span className="hidden sm:inline">New Analysis</span>
                    </button>
                )}
            </div>
            <div className="flex items-center justify-center gap-4 mb-2">
                <BrainCircuitIcon />
                <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-500">
                    Long-Form Media Deconstructor
                </h1>
            </div>
            <p className="text-lg text-slate-500 dark:text-slate-400">
                An AI-powered cognitive partner for deep content intelligence.
            </p>
            <div className="absolute top-0 right-0 flex items-center gap-2">
                 <button 
                    onClick={openPalette}
                    className="flex items-center gap-2 text-sm bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 px-3 py-2 rounded-lg transition-colors text-slate-700 dark:text-slate-300"
                    aria-label="Open command palette (Ctrl+K)"
                 >
                    <span className="hidden sm:inline">Commands</span>
                    <kbd className="hidden sm:inline text-xs font-sans border bg-slate-300 dark:bg-slate-900 border-slate-400 dark:border-slate-600 rounded px-1.5 py-0.5">⌘K</kbd>
                 </button>
                 <button
                    onClick={onShowArchive}
                    className="p-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 rounded-lg transition-colors text-slate-700 dark:text-slate-300"
                    aria-label="Open Analysis Archive"
                >
                    <ArchiveBoxIcon />
                </button>
                 <button
                    onClick={onShowSettings}
                    className="p-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 rounded-lg transition-colors text-slate-700 dark:text-slate-300"
                    aria-label="Open Settings"
                >
                    <SettingsIcon />
                </button>
                <button
                    onClick={onShowHelp}
                    className="p-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 rounded-lg transition-colors text-slate-700 dark:text-slate-300"
                    aria-label="Open Help Center"
                >
                    <HelpIcon />
                </button>
            </div>
        </header>
    );
};