
import React from 'react';
import { useAppContext } from './AppContext';
import { exportToMarkdown } from '../utils/exportUtils';
import type { AnalysisResult, AnalysisType } from '../types';
import { BackIcon, DownloadIcon, PlusIcon, DocumentIcon, AudioWaveformIcon, FilmIcon, ArchiveIcon as ArchiveTypeIcon, PhotoIcon } from './IconComponents';

const analysisTypeDetails: Record<AnalysisType, { icon: React.ReactNode, label: string }> = {
    publication: { icon: <DocumentIcon />, label: 'Publication Analysis' },
    narrative: { icon: <DocumentIcon />, label: 'Narrative Analysis' },
    audio: { icon: <AudioWaveformIcon />, label: 'Audio Analysis' },
    video: { icon: <FilmIcon />, label: 'Video Analysis' },
    image: { icon: <PhotoIcon />, label: 'Image Analysis' },
    archive: { icon: <ArchiveTypeIcon />, label: 'Archive Analysis' },
};

interface DashboardHeaderProps {
    fileName: string;
    analysisType: AnalysisType;
    onReset: () => void;
    analysisResult: AnalysisResult;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ fileName, analysisType, onReset, analysisResult }) => {
    const { isViewingArchivedItem, handleBackToArchive } = useAppContext();
    const details = analysisTypeDetails[analysisType];

    const handleExport = () => {
        exportToMarkdown(analysisResult, fileName);
    };

    return (
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <div className="flex items-center gap-3 text-brand-primary mb-2">
                    {details.icon}
                    <span className="text-sm font-semibold uppercase tracking-wider">{details.label}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 break-all">{fileName}</h1>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
                {isViewingArchivedItem && (
                     <button onClick={handleBackToArchive} title="Return to the archive list (Cmd+O)" className="flex items-center gap-2 text-sm bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 px-3 py-2 rounded-lg transition-colors text-slate-700 dark:text-slate-300">
                        <BackIcon />
                        <span className="hidden sm:inline">Back to Archive</span>
                    </button>
                )}
                <button onClick={handleExport} title="Download analysis as a Markdown file" className="flex items-center gap-2 text-sm bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 px-3 py-2 rounded-lg transition-colors text-slate-700 dark:text-slate-300">
                    <DownloadIcon />
                    <span className="hidden sm:inline">Export MD</span>
                </button>
                <button onClick={onReset} title="Start a new analysis (Cmd+N)" className="flex items-center gap-2 text-sm bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 px-3 py-2 rounded-lg transition-colors text-slate-700 dark:text-slate-300">
                    <PlusIcon />
                    <span className="hidden sm:inline">New Analysis</span>
                </button>
            </div>
        </header>
    );
};
