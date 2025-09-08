

import React, { useState, useEffect, useMemo } from 'react';
import { archiveService } from '../services/archiveService';
import type { ArchivedAnalysisItem, AnalysisType } from '../types';
import { EditAnalysisModal } from './EditAnalysisModal';
import { ConfirmationModal } from './ConfirmationModal';
import { DocumentIcon, AudioWaveformIcon, FilmIcon, ArchiveIcon as ArchiveTypeIcon, SearchIcon, EditIcon, DeleteIcon, XIcon } from './IconComponents';

interface AnalysisArchivePageProps {
    onViewItem: (id: string) => void;
}

const icons: Record<AnalysisType, React.ReactNode> = {
    publication: <DocumentIcon />, narrative: <DocumentIcon />,
    audio: <AudioWaveformIcon />, video: <FilmIcon />,
    image: <DocumentIcon />, archive: <ArchiveTypeIcon />,
};

export const AnalysisArchivePage: React.FC<AnalysisArchivePageProps> = ({ onViewItem }) => {
    const [archiveItems, setArchiveItems] = useState<ArchivedAnalysisItem[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState<AnalysisType | 'all'>('all');
    const [editingItem, setEditingItem] = useState<ArchivedAnalysisItem | null>(null);
    const [deletingItem, setDeletingItem] = useState<ArchivedAnalysisItem | null>(null);

    useEffect(() => {
        setArchiveItems(archiveService.getArchive());
    }, []);

    const handleUpdate = (updatedItem: ArchivedAnalysisItem) => {
        archiveService.updateAnalysis(updatedItem.id, {
            title: updatedItem.title,
            notes: updatedItem.notes,
        });
        setArchiveItems(archiveService.getArchive());
        setEditingItem(null);
    };

    const handleDelete = () => {
        if (deletingItem) {
            archiveService.deleteAnalysis(deletingItem.id);
            setArchiveItems(archiveService.getArchive());
            setDeletingItem(null);
        }
    };

    const filteredItems = useMemo(() => {
        return archiveItems
            .filter(item => {
                const query = searchQuery.toLowerCase();
                const titleMatch = item.title.toLowerCase().includes(query);
                const notesMatch = item.notes.toLowerCase().includes(query);
                const fileMatch = item.fileName.toLowerCase().includes(query);
                return titleMatch || notesMatch || fileMatch;
            })
            .filter(item => typeFilter === 'all' || item.analysisType === typeFilter);
    }, [archiveItems, searchQuery, typeFilter]);
    
    const analysisTypesInArchive = useMemo(() => 
        [...new Set(archiveItems.map(item => item.analysisType))],
    [archiveItems]);

    return (
        <div className="w-full animate-fade-in">
            {editingItem && (
                <EditAnalysisModal
                    item={editingItem}
                    onSave={handleUpdate}
                    onClose={() => setEditingItem(null)}
                />
            )}
            {deletingItem && (
                <ConfirmationModal
                    onConfirm={handleDelete}
                    onCancel={() => setDeletingItem(null)}
                    title="Confirm Deletion"
                >
                    <p>Are you sure you want to permanently delete the analysis for <strong className="text-slate-800 dark:text-slate-100">"{deletingItem.title}"</strong>? This action cannot be undone.</p>
                </ConfirmationModal>
            )}

            <header className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">Analysis Archive</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Your complete history of saved analyses.</p>
            </header>

            <div className="bg-slate-200/50 dark:bg-slate-800/50 p-4 rounded-lg shadow-inner sticky top-4 z-10 backdrop-blur-md border border-slate-300/50 dark:border-slate-700/50">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-grow">
                        <label htmlFor="archive-search" className="sr-only">Search archive</label>
                        <input
                            id="archive-search"
                            type="text"
                            placeholder="Search by title, notes, or filename..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                        />
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                            <SearchIcon />
                        </div>
                    </div>
                    <div className="flex-shrink-0">
                         <label htmlFor="type-filter" className="sr-only">Filter by analysis type</label>
                        <select
                            id="type-filter"
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value as AnalysisType | 'all')}
                             className="w-full sm:w-auto h-full bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                        >
                            <option value="all">All Types</option>
                            {analysisTypesInArchive.map(type => (
                                <option key={type} value={type} className="capitalize">{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <main className="mt-8">
                {filteredItems.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredItems.map(item => (
                            <div key={item.id} className="bg-slate-200 dark:bg-slate-800 rounded-lg shadow-lg flex flex-col transition-transform transform hover:-translate-y-1">
                                <div className="p-5 flex-grow">
                                    <div className="flex items-start justify-between gap-4">
                                        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2 break-all">{item.title}</h2>
                                        <div className="text-brand-primary flex-shrink-0" aria-label={`Analysis type: ${item.analysisType}`}>{icons[item.analysisType]}</div>
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                                        Saved: <time dateTime={item.createdAt}>{new Date(item.createdAt).toLocaleString()}</time>
                                    </p>
                                    <p className="text-sm text-slate-600 dark:text-slate-300 h-16 overflow-hidden text-ellipsis">
                                        {item.notes || <span className="text-slate-400 dark:text-slate-500 italic">No notes added.</span>}
                                    </p>
                                </div>
                                <div className="p-3 bg-slate-300/50 dark:bg-slate-900/50 rounded-b-lg flex justify-between items-center">
                                    <button
                                        onClick={() => onViewItem(item.id)}
                                        className="px-4 py-2 text-sm bg-brand-primary hover:bg-sky-600 text-white font-semibold rounded-md shadow transition-colors"
                                    >
                                        View Dashboard
                                    </button>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => setEditingItem(item)} className="p-2 text-slate-600 dark:text-slate-300 hover:text-brand-primary rounded-full transition-colors" aria-label={`Edit details for ${item.title}`}>
                                            <EditIcon />
                                        </button>
                                        <button onClick={() => setDeletingItem(item)} className="p-2 text-slate-600 dark:text-slate-300 hover:text-red-500 rounded-full transition-colors" aria-label={`Delete analysis for ${item.title}`}>
                                            <DeleteIcon />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300">No Analyses Found</h3>
                        <p className="text-slate-500 dark:text-slate-400 mt-2">
                            {archiveItems.length > 0 ? "Your search or filter returned no results." : "Your archive is empty. Go ahead and analyze something!"}
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
};
