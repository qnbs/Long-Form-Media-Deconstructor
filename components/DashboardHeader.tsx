
import React, { useState, useRef, useEffect } from 'react';
import type { AnalysisResult, Command } from '../types';
import type { AnalysisType } from '../types';
import { DocumentIcon, AudioWaveformIcon, FilmIcon, ArchiveIcon, BackIcon, ExportIcon, DownloadIcon, CopyIcon, MarkdownIcon, ChevronDownIcon } from './IconComponents';
import { exportToMarkdown } from '../utils/exportUtils';
import { useAppContext } from './AppContext';
import { useCommandPalette } from '../hooks/useCommandPalette';


interface DashboardHeaderProps {
    fileName: string;
    analysisType: AnalysisType;
    analysisResult: AnalysisResult;
    onReset: () => void;
}

const icons: Record<AnalysisType, React.ReactNode> = {
    publication: <DocumentIcon />,
    narrative: <DocumentIcon />,
    audio: <AudioWaveformIcon />,
    video: <FilmIcon />,
    image: <DocumentIcon />,
    archive: <ArchiveIcon />,
};

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ fileName, analysisType, analysisResult, onReset }) => {
    const { isViewingArchivedItem, handleBackToArchive } = useAppContext();
    const { registerCommands, unregisterCommands } = useCommandPalette();
    const [copyNotification, setCopyNotification] = useState('');
    const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
    const exportMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
                setIsExportMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleDownloadJson = () => {
        const jsonString = JSON.stringify(analysisResult, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const safeFileName = fileName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        a.download = `${safeFileName}_analysis.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setIsExportMenuOpen(false);
    };
    
    const handleCopyJson = () => {
        navigator.clipboard.writeText(JSON.stringify(analysisResult, null, 2));
        setCopyNotification('Copied!');
        setTimeout(() => setCopyNotification(''), 2000);
        setIsExportMenuOpen(false);
    };

    const handleDownloadMarkdown = () => {
        try {
            exportToMarkdown(analysisResult, fileName);
        } catch (error) {
            console.error("Markdown export failed:", error);
            alert("Sorry, Markdown export is not supported for this analysis type.");
        }
        setIsExportMenuOpen(false);
    };

    useEffect(() => {
        const dashboardCommands: Command[] = [
            { id: 'export_md', title: 'Export as Markdown', description: `Download analysis for "${fileName}" as a Markdown file.`, icon: <MarkdownIcon/>, action: handleDownloadMarkdown },
            { id: 'export_json', title: 'Export as JSON', description: `Download raw analysis data for "${fileName}" as a JSON file.`, icon: <DownloadIcon/>, action: handleDownloadJson },
            { id: 'copy_json', title: 'Copy JSON data', description: `Copy raw analysis data for "${fileName}" to clipboard.`, icon: <CopyIcon/>, action: handleCopyJson }
        ];

        registerCommands(dashboardCommands);
        return () => unregisterCommands(dashboardCommands.map(c => c.id));
    }, [fileName, analysisResult, registerCommands, unregisterCommands]);

    const handleBackClick = isViewingArchivedItem ? handleBackToArchive : onReset;
    const backButtonText = isViewingArchivedItem ? 'Back to Archive' : 'New Analysis';

    return (
        <header className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            {copyNotification && <div className="absolute top-12 right-0 bg-emerald-500 text-white text-xs px-3 py-1.5 rounded shadow-lg animate-fade-in-fast z-30">{copyNotification}</div>}
            <div>
                <button
                    onClick={handleBackClick}
                    className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-brand-primary transition-colors duration-300 mb-2"
                >
                    <BackIcon />
                    {backButtonText}
                </button>
                <div className="flex items-center gap-3">
                    {icons[analysisType]}
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 break-all">{fileName}</h1>
                </div>
            </div>
            <div className="relative" ref={exportMenuRef}>
                 <button
                    onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
                    className="flex items-center gap-2 text-sm bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 px-3 py-2 rounded-md transition-colors"
                    aria-haspopup="true"
                    aria-expanded={isExportMenuOpen}
                >
                    <ExportIcon /> Export
                    <ChevronDownIcon />
                </button>
                {isExportMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-slate-100 dark:bg-slate-800 rounded-md shadow-lg border border-slate-300 dark:border-slate-700 z-20 animate-fade-in-fast" role="menu">
                        <ul className="py-1">
                            <li role="presentation">
                                <button onClick={handleDownloadMarkdown} role="menuitem" className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700">
                                    <MarkdownIcon /> Download Markdown
                                </button>
                            </li>
                             <li role="presentation">
                                <button onClick={handleDownloadJson} role="menuitem" className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700">
                                    <DownloadIcon /> Download JSON
                                </button>
                            </li>
                             <li role="presentation">
                                <button onClick={handleCopyJson} role="menuitem" className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700">
                                    <CopyIcon /> Copy JSON
                                </button>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </header>
    );
};