

import React, { useEffect, useRef } from 'react';

interface ConfirmationModalProps {
    onConfirm: () => void;
    onCancel: () => void;
    title: string;
    confirmText?: string;
    children: React.ReactNode;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ onConfirm, onCancel, title, confirmText = "Confirm", children }) => {
    const modalRef = useRef<HTMLDivElement>(null);

    // Focus trapping and Escape key handling
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
                onCancel();
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
    }, [onCancel]);


    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center animate-fade-in-fast" role="alertdialog" aria-modal="true" aria-labelledby="modal-title" aria-describedby="modal-description">
            <div ref={modalRef} className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-lg shadow-xl p-6 w-full max-w-md m-4 ring-1 ring-inset ring-white/10 dark:ring-slate-700/50">
                <h2 id="modal-title" className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">{title}</h2>
                <div id="modal-description" className="text-slate-600 dark:text-slate-300 mb-6">{children}</div>
                <div className="flex justify-end gap-4">
                    <button onClick={onCancel} className="px-4 py-2 bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500 rounded-md transition-colors font-semibold">Cancel</button>
                    <button onClick={onConfirm} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors font-semibold">{confirmText}</button>
                </div>
            </div>
        </div>
    );
};