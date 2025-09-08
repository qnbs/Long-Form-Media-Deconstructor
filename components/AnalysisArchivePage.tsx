
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { archiveService } from '../services/archiveService';
import type { ArchivedAnalysisItem, AnalysisType } from '../types';
import { EditAnalysisModal } from './EditAnalysisModal';
import { ConfirmationModal } from './ConfirmationModal';
import { DocumentIcon, AudioWaveformIcon, FilmIcon, ArchiveIcon as ArchiveTypeIcon, SearchIcon, EditIcon, DeleteIcon, PhotoIcon } from './IconComponents';

interface AnalysisArchivePageProps {
    onViewItem: (id: string) => void;
}

const icons: Record<AnalysisType, React.ReactNode> = {
    publication: <DocumentIcon />, narrative: <DocumentIcon />,
    audio: <AudioWaveformIcon />, video: <FilmIcon />,
    image: <PhotoIcon />, archive: <ArchiveTypeIcon />,
};

// --- New Markdown Notes Renderer with Task List support ---

const MarkdownNotesRenderer: React.FC<{
  item: ArchivedAnalysisItem;
  onUpdate: (updatedItem: ArchivedAnalysisItem) => void;
}> = ({ item, onUpdate }) => {
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    }
  }, []);

  const handleToggleTask = (lineIndex: number) => {
    const lines = item.notes.split('\n');
    const line = lines[lineIndex];
    let isCompleting = false;

    if (line.startsWith('- [ ] ')) {
      lines[lineIndex] = line.replace('- [ ] ', '- [x] ');
      isCompleting = true;
    } else if (line.startsWith('- [x] ')) {
      lines[lineIndex] = line.replace('- [x] ', '- [ ] ');
    }
    const newNotes = lines.join('\n');
    
    // Trigger highlight animation only when completing a task
    if (isCompleting) {
        setHighlightedIndex(lineIndex);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = window.setTimeout(() => setHighlightedIndex(null), 600);
    }

    onUpdate({ ...item, notes: newNotes });
  };

  const renderLine = (line: string, index: number) => {
    const taskMatch = line.match(/^- \[( |x)\] (.*)/);
    if (taskMatch) {
      const isCompleted = taskMatch[1] === 'x';
      const text = taskMatch[2];
      const shouldHighlight = highlightedIndex === index;

      return (
        <div key={index} className={`task-item ${isCompleted ? 'completed' : ''} ${shouldHighlight ? 'animate-highlight' : ''}`}>
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              className="task-checkbox"
              checked={isCompleted}
              onChange={() => handleToggleTask(index)}
              aria-label={text}
            />
            <span className="task-item-text group-hover:text-slate-800 dark:group-hover:text-slate-100 transition-colors">{text}</span>
          </label>
        </div>
      );
    }
    // Render non-task lines, preserving whitespace and handling empty lines
    return <p key={index} className="whitespace-pre-wrap leading-normal">{line || '\u00A0'}</p>;
  };

  if (!item.notes) {
      return <p className="text-slate-400 dark:text-slate-500 italic">No notes added.</p>;
  }
  
  return (
    <div className="space-y-1 text-sm text-slate-600 dark:text-slate-300">
      {item.notes.split('\n').map(renderLine)}
    </div>
  );
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
        setEditingItem(null); // Close modal if it was open
    };
    
    const handleNotesUpdate = (updatedItem: ArchivedAnalysisItem) => {
        archiveService.updateAnalysis(updatedItem.id, {
            notes: updatedItem.notes,
        });
         // Optimistically update the UI
        setArchiveItems(prevItems => prevItems.map(i => i.id === updatedItem.id ? { ...i, notes: updatedItem.notes, updatedAt: new Date().toISOString() } : i));
    }

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

            <div className="bg-white/10 dark:bg-slate-900/20 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 p-4 rounded-xl shadow-lg sticky top-24 z-10 ring-1 ring-inset ring-white/10 dark:ring-slate-700/50">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-grow">
                        <label htmlFor="archive-search" className="sr-only">Search archive</label>
                        <input
                            id="archive-search"
                            type="text"
                            placeholder="Search by title, notes, or filename..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/20 dark:bg-slate-800/40 border border-slate-300/50 dark:border-slate-600/50 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-primary placeholder:text-slate-500 dark:placeholder:text-slate-400"
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
                             className="w-full sm:w-auto h-full bg-white/20 dark:bg-slate-800/40 border border-slate-300/50 dark:border-slate-600/50 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                        >
                            <option value="all">All Types</option>
                            {analysisTypesInArchive.map(type => (
                                <option key={type} value={type} className="capitalize bg-white dark:bg-slate-800">{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <main className="mt-8">
                {filteredItems.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredItems.map(item => (
                            <div key={item.id} className="bg-white/10 dark:bg-slate-900/20 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-lg shadow-lg flex flex-col transition-transform transform hover:-translate-y-1 ring-1 ring-inset ring-white/10 dark:ring-slate-700/50">
                                <div className="p-5 flex-grow">
                                    <div className="flex items-start justify-between gap-4">
                                        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2 break-all">{item.title}</h2>
                                        <div className="text-brand-primary flex-shrink-0" title={`Analysis type: ${item.analysisType}`} aria-label={`Analysis type: ${item.analysisType}`}>{icons[item.analysisType]}</div>
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                                        Saved: <time dateTime={item.createdAt}>{new Date(item.createdAt).toLocaleString()}</time>
                                    </p>
                                    <div className="h-20 overflow-y-auto pr-2">
                                        <MarkdownNotesRenderer item={item} onUpdate={handleNotesUpdate} />
                                    </div>
                                </div>
                                <div className="p-3 bg-black/5 dark:bg-black/20 rounded-b-lg flex justify-between items-center">
                                    <button
                                        onClick={() => onViewItem(item.id)}
                                        title="View full analysis dashboard"
                                        className="px-4 py-2 text-sm bg-brand-primary hover:bg-sky-600 text-white font-semibold rounded-md shadow transition-colors"
                                    >
                                        View Dashboard
                                    </button>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => setEditingItem(item)} className="p-2 text-slate-600 dark:text-slate-300 hover:text-brand-primary rounded-full transition-colors" title="Edit title and notes" aria-label={`Edit details for ${item.title}`}>
                                            <EditIcon />
                                        </button>
                                        <button onClick={() => setDeletingItem(item)} className="p-2 text-slate-600 dark:text-slate-300 hover:text-red-500 rounded-full transition-colors" title="Delete this analysis" aria-label={`Delete analysis for ${item.title}`}>
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
