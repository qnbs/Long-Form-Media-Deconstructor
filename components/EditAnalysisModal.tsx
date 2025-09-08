import React, { useState, useEffect, useRef } from 'react';
import type { ArchivedAnalysisItem } from '../types';
import { MarkdownPreview } from './MarkdownPreview';

interface EditAnalysisModalProps {
    item: ArchivedAnalysisItem;
    onSave: (item: ArchivedAnalysisItem) => void;
    onClose: () => void;
}

type ViewMode = 'edit' | 'split' | 'preview';

export const EditAnalysisModal: React.FC<EditAnalysisModalProps> = ({ item, onSave, onClose }) => {
    const [title, setTitle] = useState(item.title);
    const [notes, setNotes] = useState(item.notes);
    const [viewMode, setViewMode] = useState<ViewMode>('split');
    const modalRef = useRef<HTMLDivElement>(null);

    // Focus trapping and Escape key handling for accessibility
    useEffect(() => {
        const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusableElements || focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        firstElement.focus();

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
                return;
            }

            if (e.key !== 'Tab') return;

            if (e.shiftKey) { // Shift+Tab
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                }
            } else { // Tab
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        };
        
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);


    const handleSave = () => {
        onSave({ ...item, title, notes });
    };

    const ViewToggle: React.FC = () => (
        <div className="flex p-1 bg-slate-200/80 dark:bg-slate-800/50 rounded-lg">
            {(['edit', 'split', 'preview'] as ViewMode[]).map(mode => (
                 <button 
                    key={mode} 
                    onClick={() => setViewMode(mode)}
                    className={`w-1/3 py-1 px-2 text-xs font-semibold rounded-md transition-colors capitalize ${viewMode === mode ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow' : 'text-slate-500 hover:bg-white/50 dark:hover:bg-slate-900/30'}`}
                >
                    {mode}
                </button>
            ))}
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xl z-50 flex items-center justify-center animate-fade-in-fast" role="dialog" aria-modal="true" aria-labelledby="edit-modal-title">
            <div ref={modalRef} className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-white/20 dark:border-slate-700/50 rounded-lg shadow-2xl p-6 w-full max-w-4xl m-4 flex flex-col max-h-[90vh] ring-1 ring-inset ring-white/10 dark:ring-slate-700/50">
                <div className="flex-shrink-0">
                    <h2 id="edit-modal-title" className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">Edit Analysis Details</h2>
                </div>
                
                <div className="flex-grow space-y-4 overflow-y-auto pr-2">
                    <div>
                        <label htmlFor="edit-title" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label>
                        <input
                            id="edit-title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-white/50 dark:bg-slate-800/50 border border-slate-300/50 dark:border-slate-600/50 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                        />
                    </div>
                    <div className="flex flex-col h-full min-h-[40vh]">
                        <div className="flex justify-between items-center mb-1">
                             <label htmlFor="edit-notes" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                Notes
                            </label>
                            <ViewToggle />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow min-h-0">
                            {(viewMode === 'edit' || viewMode === 'split') && (
                                <textarea
                                    id="edit-notes"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className={`w-full h-full min-h-[200px] resize-none bg-white/50 dark:bg-slate-800/50 border border-slate-300/50 dark:border-slate-600/50 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-primary font-mono text-sm ${viewMode === 'split' ? '' : 'md:col-span-2'}`}
                                    placeholder="Add notes... Markdown is supported, including `- [ ]` for tasks."
                                />
                            )}
                             {(viewMode === 'preview' || viewMode === 'split') && (
                                <div className={`w-full h-full min-h-[200px] bg-white/30 dark:bg-slate-800/30 border border-slate-300/50 dark:border-slate-600/50 rounded-lg p-3 overflow-y-auto ${viewMode === 'split' ? '' : 'md:col-span-2'}`}>
                                    <MarkdownPreview markdownText={notes} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-4 mt-6 flex-shrink-0">
                    <button onClick={onClose} className="px-4 py-2 bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500 rounded-md transition-colors font-semibold">Cancel</button>
                    <button onClick={handleSave} className="px-4 py-2 bg-brand-primary hover:bg-sky-600 text-white rounded-md transition-colors font-semibold">Save Changes</button>
                </div>
            </div>
        </div>
    );
};