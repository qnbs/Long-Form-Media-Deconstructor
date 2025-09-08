

import React, { useState, useEffect, useCallback } from 'react';
import { AppContext } from './components/AppContext';
import { Header } from './components/Header';
import { FileUpload } from './components/FileUpload';
import { Loader } from './components/Loader';
import { AnalysisDashboard } from './components/AnalysisDashboard';
import { NarrativeAnalysisDashboard } from './components/NarrativeAnalysisDashboard';
import { AudioAnalysisDashboard } from './components/AudioAnalysisDashboard';
import { VideoNarrativeDashboard } from './components/VideoNarrativeDashboard';
import { ImageAnalysisDashboard } from './components/ImageAnalysisDashboard';
import { ArchiveAnalysisDashboard } from './components/ArchiveAnalysisDashboard';
import { TextTypeSelector } from './components/TextTypeSelector';
import { SettingsPage } from './components/SettingsPage';
import { HelpCenter } from './components/HelpCenter';
import { AnalysisArchivePage } from './components/AnalysisArchivePage';
import { WelcomePortal } from './components/WelcomePortal';
import { CommandPalette } from './components/CommandPalette';
import {
    runAnalysisPipeline,
    runTextAnalysis,
    runUrlAnalysis,
    runYoutubeAnalysis,
    runTedTalkAnalysis,
    runArchiveOrgAnalysis,
    runArchiveAnalysisPipeline
} from './services/orchestrator';
import { settingsService } from './services/settingsService';
import { archiveService } from './services/archiveService';
import type { AnalysisResult, AnalysisMode, Settings, AnalysisType, Command, AudioAnalysisResult, VideoNarrativeAnalysisResult, ImageAnalysisResult } from './types';
import { useCommandPalette } from './hooks/useCommandPalette';
import { ErrorIcon, HelpIcon, SettingsIcon, ArchiveBoxIcon, PlusIcon } from './components/IconComponents';

const SESSION_KEY = 'deconstructor_session';
const VISITED_KEY = 'deconstructor_has_visited';

type AppView = 'welcome' | 'upload' | 'loading' | 'text_type_selector' | 'result' | 'settings' | 'help' | 'archive';

// Refactored SessionState for simplicity and robustness.
// URLs are now part of the AnalysisResult object, not top-level session state.
interface SessionState {
  view: AppView;
  result: AnalysisResult | null;
  fileName: string;
  fileNames?: string[]; // For archive analysis type
}

const useAppCommands = (session: SessionState, setSession: React.Dispatch<React.SetStateAction<SessionState>>, resetAnalysis: () => void) => {
    const { registerCommands, unregisterCommands } = useCommandPalette();

    useEffect(() => {
        const baseCommands: Command[] = [
            { id: 'help', title: 'Help Center', description: 'Open the help and tutorial guide', icon: <HelpIcon />, action: () => setSession(prev => ({...prev, view: 'help'})) },
            { id: 'settings', title: 'Settings', description: 'Configure application settings', icon: <SettingsIcon />, action: () => setSession(prev => ({...prev, view: 'settings'})) },
            { id: 'archive', title: 'View Archive', description: 'Browse all your saved analyses', icon: <ArchiveBoxIcon />, action: () => setSession(prev => ({...prev, view: 'archive'})) },
        ];

        let contextualCommands: Command[] = [];
        if (session.view === 'archive' || session.view === 'result') {
            contextualCommands.push({ id: 'new_analysis', title: 'New Analysis', description: 'Start a new analysis from scratch', icon: <PlusIcon />, action: resetAnalysis });
        }
        
        const allCommands = [...baseCommands, ...contextualCommands];
        registerCommands(allCommands);

        return () => {
            unregisterCommands(allCommands.map(c => c.id));
        };

    }, [session.view, setSession, resetAnalysis, registerCommands, unregisterCommands]);
};


const App: React.FC = () => {
  const [session, setSession] = useState<SessionState>({ view: 'upload', result: null, fileName: '' });
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [pendingTextContent, setPendingTextContent] = useState<string | null>(null);
  const [settings, setSettings] = useState<Settings>(settingsService.loadSettings());
  const [isViewingArchivedItem, setIsViewingArchivedItem] = useState(false);

  useEffect(() => {
    settingsService.applySettings(settings);
    const hasVisited = localStorage.getItem(VISITED_KEY);
    const storedSession = localStorage.getItem(SESSION_KEY);

    if (!hasVisited) {
      setSession({ view: 'welcome', result: null, fileName: '' });
    } else if (storedSession) {
      try {
        const parsedSession: SessionState = JSON.parse(storedSession);
        setSession(parsedSession);
      } catch {
        localStorage.removeItem(SESSION_KEY);
      }
    }
  }, []);

  useEffect(() => {
    if (session.view !== 'welcome' && session.view !== 'loading') {
      try {
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      } catch (e) {
        console.error("Failed to save session state:", e);
      }
    }
  }, [session]);
  
  const handleSaveSettings = (newSettings: Settings) => {
    setSettings(newSettings);
    settingsService.saveSettings(newSettings);
    settingsService.applySettings(newSettings);
    setSession(prev => ({ ...prev, view: 'upload' }));
  };

  const resetAnalysis = useCallback(() => {
    setSession({ view: 'upload', result: null, fileName: '' });
    setError(null);
    setLoadingMessage('');
    setPendingTextContent(null);
    setIsViewingArchivedItem(false);
    settingsService.clearSession();
  }, []);
  
  useAppCommands(session, setSession, resetAnalysis);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.metaKey || e.ctrlKey) {
            // Check if focus is on an input field to avoid overriding copy/paste etc.
            const target = e.target as HTMLElement;
            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
                return;
            }

            switch(e.key.toLowerCase()) {
                case 'n': // New Analysis
                    e.preventDefault();
                    resetAnalysis();
                    break;
                case 'o': // Open Archive
                    e.preventDefault();
                    setSession(prev => ({...prev, view: 'archive'}));
                    break;
                case 's': // Open Settings
                    e.preventDefault();
                    setSession(prev => ({...prev, view: 'settings'}));
                    break;
                 case 'h': // Open Help
                    e.preventDefault();
                    setSession(prev => ({...prev, view: 'help'}));
                    break;
            }
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [resetAnalysis]);
  
  const updateProgress = (message: string) => {
    setLoadingMessage(message);
  };

  const handleAnalysisError = (e: any) => {
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred during analysis.';
    setError(errorMessage);
    setSession(prev => ({ ...prev, view: 'upload' }));
  };

  const runAndSaveAnalysis = async (
    analysisFn: () => Promise<{ type: AnalysisType, data: AnalysisResult } | { type: 'text_content', data: string }>,
    baseData: { fileName: string, fileNames?: string[], localMediaUrl?: string }
  ) => {
      try {
          const result = await analysisFn();
          if (result.type === 'text_content') {
              setPendingTextContent(result.data);
              setSession(prev => ({...prev, view: 'text_type_selector', fileName: baseData.fileName}));
              return;
          }

          if (baseData.localMediaUrl) {
            if (result.data.type === 'audio') result.data.fileUrl = baseData.localMediaUrl;
            if (result.data.type === 'video') result.data.videoUrl = baseData.localMediaUrl;
            if (result.data.type === 'image') result.data.imageUrl = baseData.localMediaUrl;
          }

          archiveService.addAnalysis({ 
            fileName: baseData.fileName,
            fileNames: baseData.fileNames,
            analysisType: result.type as AnalysisType, 
            analysisResult: result.data,
            mediaUrl: baseData.localMediaUrl
          });
          
          setSession({
              view: 'result',
              result: result.data,
              fileName: baseData.fileName,
              fileNames: baseData.fileNames
          });
      } catch (e) {
          handleAnalysisError(e);
      }
  };
  
  const handleSingleFileSelect = async (file: File, mode: AnalysisMode) => {
    setError(null);
    if (file.type === 'text/plain') {
        const text = await file.text();
        setPendingTextContent(text);
        setSession({ view: 'text_type_selector', fileName: file.name, result: null });
        return;
    }
    setSession(prev => ({ ...prev, view: 'loading', fileName: file.name }));
    const fileUrl = URL.createObjectURL(file);
    await runAndSaveAnalysis(
      () => runAnalysisPipeline(file, updateProgress, mode),
      { fileName: file.name, localMediaUrl: fileUrl }
    );
  };
  
  const handleArchiveSubmit = async (files: File[], mode: AnalysisMode) => {
    if (files.length === 0) return;
    setError(null);
    const projectTitle = `Archive (${files.length} files)`;
    setSession({ view: 'loading', fileName: projectTitle, result: null });
    await runAndSaveAnalysis(
        () => runArchiveAnalysisPipeline(files, updateProgress, mode),
        { fileName: projectTitle, fileNames: files.map(f => f.name) }
    );
  };
  
  const handleTextTypeSelect = async (type: 'publication' | 'narrative', mode: AnalysisMode) => {
    if (!pendingTextContent || !session.fileName) return;
    setError(null);
    setSession(prev => ({ ...prev, view: 'loading' }));
    const textContent = pendingTextContent;
    setPendingTextContent(null);
    await runAndSaveAnalysis(
        () => runTextAnalysis(textContent, updateProgress, mode, type),
        { fileName: session.fileName }
    );
  };
  
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
  const tedTalkRegex = /^(https?:\/\/)?(www\.)?ted\.com\/talks\/.+$/;
  const archiveOrgRegex = /^(https?:\/\/)?(www\.)?archive\.org\/(details|embed)\/.+$/;

  const handleUrlSubmit = async (url: string, mode: AnalysisMode) => {
    setError(null);
    setSession({ view: 'loading', fileName: url, result: null });

    if (archiveOrgRegex.test(url)) {
        await runAndSaveAnalysis(() => runArchiveOrgAnalysis(url, updateProgress, mode), { fileName: `Archive.org: ${url}` });
    } else if (tedTalkRegex.test(url)) {
        await runAndSaveAnalysis(() => runTedTalkAnalysis(url, updateProgress, mode), { fileName: `TED Talk: ${url}` });
    } else if (youtubeRegex.test(url)) {
        await runAndSaveAnalysis(() => runYoutubeAnalysis(url, updateProgress, mode), { fileName: `YouTube: ${url}` });
    } else {
        try {
            const textContent = await runUrlAnalysis(url, updateProgress);
            if (!textContent) throw new Error("Could not extract any text content from the URL.");
            setPendingTextContent(textContent);
            setSession({ view: 'text_type_selector', fileName: url, result: null });
        } catch (e) {
            handleAnalysisError(e);
        }
    }
  };
  
  const handleViewArchivedItem = (id: string) => {
    const item = archiveService.getAnalysisById(id);
    if (item) {
      const resultWithUrl = { ...item.analysisResult };
      
      if (item.mediaUrl) {
        if (resultWithUrl.type === 'audio') (resultWithUrl as AudioAnalysisResult).fileUrl = item.mediaUrl;
        if (resultWithUrl.type === 'video') (resultWithUrl as VideoNarrativeAnalysisResult).videoUrl = item.mediaUrl;
        if (resultWithUrl.type === 'image') (resultWithUrl as ImageAnalysisResult).imageUrl = item.mediaUrl;
      }

      setSession({
        view: 'result',
        result: resultWithUrl,
        fileName: item.title,
        fileNames: item.fileNames,
      });
      setIsViewingArchivedItem(true);
    }
  };
  
  const handleBackToArchive = () => {
    setSession({ view: 'archive', result: null, fileName: '' });
    setIsViewingArchivedItem(false);
  };

  const renderContent = () => {
    if (error) {
      return (
        <div role="alert" className="text-center p-8 bg-red-500/10 border border-red-500/20 rounded-lg max-w-2xl mx-auto">
            <ErrorIcon />
            <h2 className="text-xl font-bold text-red-400 mt-4">Analysis Failed</h2>
            <p className="text-slate-400 mt-2">{error}</p>
            <button onClick={resetAnalysis} className="mt-6 px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg shadow-md transition-colors">Try Again</button>
        </div>
      );
    }

    switch (session.view) {
        case 'welcome': return <WelcomePortal onEnterApp={() => { localStorage.setItem(VISITED_KEY, 'true'); resetAnalysis(); }} />;
        case 'loading': return <Loader message={loadingMessage || `Analyzing ${session.fileName}...`} />;
        case 'text_type_selector': return <TextTypeSelector onSelect={(type) => handleTextTypeSelect(type, settings.defaultAnalysisMode)} onCancel={resetAnalysis} />;
        case 'result':
          if (!session.result) { setError("Analysis result is missing."); return null; }
          switch (session.result.type) {
            case 'publication': return <AnalysisDashboard result={session.result} fileName={session.fileName} />;
            case 'narrative': return <NarrativeAnalysisDashboard result={session.result} fileName={session.fileName} />;
            case 'audio': return <AudioAnalysisDashboard result={session.result} fileName={session.fileName} />;
            case 'video': return <VideoNarrativeDashboard result={session.result} fileName={session.fileName} />;
            case 'image': return <ImageAnalysisDashboard result={session.result} fileName={session.fileName} />;
            case 'archive': return <ArchiveAnalysisDashboard result={session.result} projectTitle={session.fileName} fileNames={session.fileNames || []} />;
            default: setError(`Unknown analysis result type: ${(session.result as any).type}`); return null;
          }
        case 'settings': return <SettingsPage settings={settings} onSave={handleSaveSettings} onBack={() => setSession(prev => ({...prev, view: 'upload'}))} />;
        case 'help': return <HelpCenter onBack={() => setSession(prev => ({...prev, view: 'upload'}))} />;
        case 'archive': return <AnalysisArchivePage onViewItem={handleViewArchivedItem} />;
        case 'upload':
        default:
          return <FileUpload onSingleFileSelect={handleSingleFileSelect} onArchiveSubmit={handleArchiveSubmit} onUrlSubmit={handleUrlSubmit} defaultAnalysisType={settings.defaultAnalysisType} defaultAnalysisMode={settings.defaultAnalysisMode} />;
    }
  };

  const showHeader = session.view === 'upload' || session.view === 'archive';

  return (
    <AppContext.Provider value={{ settings, resetAnalysis, isViewingArchivedItem, handleBackToArchive }}>
      <div className={`min-h-screen font-sans bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 transition-colors duration-500`}>
        <CommandPalette />
        <div className="container mx-auto px-4 py-8">
          {showHeader && (
            <Header 
              onShowHelp={() => setSession(prev => ({...prev, view: 'help'}))} 
              onShowSettings={() => setSession(prev => ({...prev, view: 'settings'}))} 
              onShowArchive={() => setSession(prev => ({...prev, view: 'archive'}))}
              onNewAnalysis={session.view === 'archive' ? resetAnalysis : undefined}
            />
          )}
          <main className={`flex flex-col items-center justify-center ${showHeader ? 'mt-12' : ''}`}>
            {renderContent()}
          </main>
        </div>
      </div>
    </AppContext.Provider>
  );
}

export default App;
