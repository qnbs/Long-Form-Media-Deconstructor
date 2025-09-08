

import React from 'react';
import { BrainCircuitIcon, HelpIcon, PlusIcon, SettingsIcon, ArchiveBoxIcon, SearchIcon } from './IconComponents';
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
        <>
            {/* --- Desktop Header (Top) --- */}
            <header className="fixed top-0 left-0 right-0 z-30 bg-white/80 dark:bg-slate-950/50 backdrop-blur-xl border-b border-slate-300/20 dark:border-slate-700/20 transition-colors duration-500 hidden sm:flex">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    {/* Left side icons */}
                    <div className="flex items-center gap-2">
                        {onNewAnalysis && (
                             <button
                                onClick={onNewAnalysis}
                                className="flex items-center gap-2 text-sm bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 px-3 py-2 rounded-lg transition-colors text-slate-700 dark:text-slate-300"
                                aria-label="Start New Analysis"
                                title="Start New Analysis (Cmd+N)"
                            >
                                <PlusIcon />
                                <span className="hidden sm:inline">New Analysis</span>
                            </button>
                        )}
                         <button 
                            onClick={openPalette}
                            className="flex items-center gap-2 text-sm bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 px-3 py-2 rounded-lg transition-colors text-slate-700 dark:text-slate-300"
                            aria-label="Open command palette (Ctrl+K)"
                            title="Open command palette (Cmd+K)"
                         >
                            <span className="hidden sm:inline">Commands</span>
                            <kbd className="hidden sm:inline text-xs font-sans border bg-slate-200 dark:bg-slate-900 border-slate-400 dark:border-slate-600 rounded px-1.5 py-0.5">⌘K</kbd>
                         </button>
                         <div className="flex items-center gap-2 ml-2">
                            <button
                                onClick={onShowArchive}
                                className="p-2 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 rounded-lg transition-colors text-slate-700 dark:text-slate-300"
                                aria-label="Open Analysis Archive"
                                title="Open Analysis Archive (Cmd+O)"
                            >
                                <ArchiveBoxIcon />
                            </button>
                            <button
                                onClick={onShowSettings}
                                className="p-2 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 rounded-lg transition-colors text-slate-700 dark:text-slate-300"
                                aria-label="Open Settings"
                                title="Open Settings (Cmd+S)"
                            >
                                <SettingsIcon />
                            </button>
                            <button
                                onClick={onShowHelp}
                                className="p-2 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 rounded-lg transition-colors text-slate-700 dark:text-slate-300"
                                aria-label="Open Help Center"
                                title="Open Help Center (Cmd+H)"
                            >
                                <HelpIcon />
                            </button>
                        </div>
                    </div>

                    {/* Right side title */}
                    <div className="flex items-center gap-3">
                        <h1 className="hidden sm:block text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-indigo-500 dark:from-sky-400 dark:to-indigo-500">
                            Long-Form Media Deconstructor
                        </h1>
                        <BrainCircuitIcon />
                    </div>
                </div>
            </header>

            {/* --- Mobile Navigation (Bottom) --- */}
            <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/80 dark:bg-slate-950/50 backdrop-blur-xl border-t border-slate-300/20 dark:border-slate-700/20">
                 <div className="container mx-auto px-2 py-2 flex justify-around items-center">
                     {onNewAnalysis && (
                         <button onClick={onNewAnalysis} className="flex flex-col items-center gap-1 text-xs text-slate-600 dark:text-slate-300 hover:text-brand-primary" title="New Analysis (Cmd+N)">
                            <PlusIcon />
                            <span>New</span>
                         </button>
                     )}
                     <button onClick={onShowArchive} className="flex flex-col items-center gap-1 text-xs text-slate-600 dark:text-slate-300 hover:text-brand-primary" title="Archive (Cmd+O)">
                        <ArchiveBoxIcon />
                        <span>Archive</span>
                     </button>
                      <button onClick={openPalette} className="flex flex-col items-center gap-1 text-xs text-slate-600 dark:text-slate-300 hover:text-brand-primary" title="Commands (Cmd+K)">
                        <SearchIcon />
                        <span>Commands</span>
                     </button>
                     <button onClick={onShowSettings} className="flex flex-col items-center gap-1 text-xs text-slate-600 dark:text-slate-300 hover:text-brand-primary" title="Settings (Cmd+S)">
                        <SettingsIcon />
                        <span>Settings</span>
                     </button>
                      <button onClick={onShowHelp} className="flex flex-col items-center gap-1 text-xs text-slate-600 dark:text-slate-300 hover:text-brand-primary" title="Help (Cmd+H)">
                        <HelpIcon />
                        <span>Help</span>
                     </button>
                 </div>
            </nav>
        </>
    );
};