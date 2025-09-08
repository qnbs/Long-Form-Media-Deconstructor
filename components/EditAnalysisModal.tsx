
import React, { useState, useEffect, useRef } from 'react';
import type { ArchivedAnalysisItem } from '../types';

interface EditAnalysisModalProps {
    item: ArchivedAnalysisItem;
    onSave: (item: ArchivedAnalysisItem) => void;
    onClose: () => void;
}

export const EditAnalysisModal: React.FC<EditAnalysisModalProps> = ({ item, onSave, onClose }) => {
    const [title, setTitle] = useState(item.title);
    const [notes, setNotes] = useState(item.notes);
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

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center animate-fade-in-fast" role="dialog" aria-modal="true" aria-labelledby="edit-modal-title">
            <div ref={modalRef} className="bg-slate-200 dark:bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-2xl m-4 flex flex-col max-h-[90vh]">
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
                            className="w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                        />
                    </div>
                    <div>
                        <label htmlFor="edit-notes" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Notes (Markdown supported)</label>
                        <textarea
                            id="edit-notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={10}
                            className="w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-primary font-mono text-sm"
                            placeholder="Add your observations, summaries, or any other relevant notes here..."
                        />
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