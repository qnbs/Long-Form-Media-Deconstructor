import React, { useCallback, useState, useEffect } from 'react';
import { 
    DocumentIcon, 
    ArchiveIcon, 
    XIcon, 
    GlobeIcon, 
    YoutubeIcon, 
    TedIcon, 
    ArchiveOrgIcon, 
    GaugeIcon,
    AudioWaveformIcon,
    FilmIcon,
    PhotoIcon
} from './IconComponents';
import type { AnalysisMode, DefaultAnalysisType } from '../types';

interface FileUploadProps {
  onSingleFileSelect: (file: File, mode: AnalysisMode) => void;
  onArchiveSubmit: (files: File[], mode: AnalysisMode) => void;
  onUrlSubmit: (url: string, mode: AnalysisMode) => void;
  defaultAnalysisType: DefaultAnalysisType;
  defaultAnalysisMode: AnalysisMode;
}

const acceptedFileString = ".txt,audio/*,video/mp4,video/quicktime,image/jpeg,image/png";
const supportedTypes = [
    "text/plain",
    "audio/mpeg", "audio/wav", "audio/webm", "audio/ogg",
    "video/mp4", "video/quicktime", "video/webm",
    "image/jpeg", "image/png"
];

const isFileTypeSupported = (file: File): boolean => {
    // Check against wildcard types like 'audio/*'
    const generalType = file.type.split('/')[0] + '/*';
    if (supportedTypes.includes(generalType)) {
        return true;
    }
    return supportedTypes.includes(file.type);
};

const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const getFileIcon = (fileType: string): React.ReactNode => {
    if (fileType.startsWith('audio/')) return <AudioWaveformIcon />;
    if (fileType.startsWith('video/')) return <FilmIcon />;
    if (fileType.startsWith('image/')) return <PhotoIcon />;
    return <DocumentIcon />;
};

export const FileUpload: React.FC<FileUploadProps> = ({ onSingleFileSelect, onArchiveSubmit, onUrlSubmit, defaultAnalysisType, defaultAnalysisMode }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [projectType, setProjectType] = useState<'single' | 'archive'>(defaultAnalysisType);
  const [stagedFiles, setStagedFiles] = useState<File[]>([]);
  const [analysisMode, setAnalysisMode] = useState<AnalysisMode>(defaultAnalysisMode);
  const [singleInputMode, setSingleInputMode] = useState<'upload' | 'url'>('upload');
  const [urlInput, setUrlInput] = useState('');
  const [fileError, setFileError] = useState<string | null>(null);
  const [markedForRemoval, setMarkedForRemoval] = useState<Set<File>>(new Set());

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;
    setFileError(null);

    const fileList = Array.from(files);

    // Validate all files before processing
    const unsupportedFile = fileList.find(file => !isFileTypeSupported(file));
    if (unsupportedFile) {
        setFileError(`Unsupported file type: "${unsupportedFile.name}". Please upload text, audio, video, or image files.`);
        return;
    }

    if (projectType === 'single') {
        onSingleFileSelect(fileList[0], analysisMode);
    } else {
        setStagedFiles(prev => {
            const newFiles = fileList;
            const allFiles = [...prev, ...newFiles];
            return allFiles.filter((file, index, self) => 
                index === self.findIndex(f => f.name === file.name && f.size === file.size)
            );
        });
    }
  }, [projectType, analysisMode, onSingleFileSelect]);
  
  useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => {
        const target = event.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
            return;
        }

        if (event.clipboardData?.files.length) {
            event.preventDefault();
            handleFiles(event.clipboardData.files);
        }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [handleFiles]);

  const removeStagedFile = (fileToRemove: File) => {
      setStagedFiles(prev => prev.filter(file => file !== fileToRemove));
      setMarkedForRemoval(prev => {
          const newSet = new Set(prev);
          newSet.delete(fileToRemove);
          return newSet;
      });
  };

  const handleToggleMarkForRemoval = (file: File) => {
      if (markedForRemoval.has(file)) {
          removeStagedFile(file);
      } else {
          setMarkedForRemoval(prev => new Set(prev).add(file));
      }
  };
  
  const handleUrlFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedUrl = urlInput.trim();
    if (trimmedUrl) {
      onUrlSubmit(trimmedUrl, analysisMode);
    }
  };

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); setFileError(null); }, []);
  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); }, []);
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); }, []);
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); e.stopPropagation(); setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => { handleFiles(e.target.files); };
  
  const dragDropClasses = isDragging 
    ? 'border-brand-primary bg-sky-500/10 ring-2 ring-brand-primary ring-offset-2 ring-offset-slate-50 dark:ring-offset-slate-900 animate-subtle-glow' 
    : 'border-slate-400/30 dark:border-slate-600/50 hover:border-brand-primary';

  const renderSingleFileContent = () => {
    return (
      <>
        <div className="flex justify-center p-1 bg-white/10 dark:bg-slate-900/30 backdrop-blur-md border border-white/20 dark:border-slate-700/50 rounded-lg mb-6 max-w-xs mx-auto" role="tablist" aria-label="Input mode">
            <button onClick={() => setSingleInputMode('upload')} role="tab" aria-selected={singleInputMode === 'upload'} title="Upload a file from your device" className={`w-1/2 px-4 py-2 rounded-md text-sm font-semibold transition-colors ${singleInputMode === 'upload' ? 'bg-brand-secondary text-white shadow-lg' : 'text-slate-600 dark:text-slate-300 hover:bg-white/20 dark:hover:bg-slate-700/50'}`}>Upload File</button>
            <button onClick={() => setSingleInputMode('url')} role="tab" aria-selected={singleInputMode === 'url'} title="Analyze content from a web URL" className={`w-1/2 px-4 py-2 rounded-md text-sm font-semibold transition-colors ${singleInputMode === 'url' ? 'bg-brand-secondary text-white shadow-lg' : 'text-slate-600 dark:text-slate-300 hover:bg-white/20 dark:hover:bg-slate-700/50'}`}>From URL</button>
        </div>
        {singleInputMode === 'upload' ? (
             <div
                className={`relative flex flex-col items-center justify-center w-full p-8 border-2 border-dashed rounded-xl transition-all duration-300 ${dragDropClasses} bg-white/10 dark:bg-slate-900/20 backdrop-blur-md`}
                onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDragOver={handleDragOver} onDrop={handleDrop}
                aria-label="File upload area. Drag and drop, paste, or click to browse."
                title="Drop a single file. If multiple files are dropped, only the first will be analyzed."
              >
                <input type="file" id="file-upload" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileChange} accept={acceptedFileString} multiple={false} aria-describedby="file-upload-desc" />
                <div className="p-4 bg-white/20 dark:bg-slate-800/40 rounded-full mb-4"><DocumentIcon /></div>
                <p className="text-xl font-semibold text-slate-800 dark:text-slate-100">Drag & drop, paste, or <label htmlFor="file-upload" className="text-brand-primary font-medium cursor-pointer hover:underline">click to upload</label></p>
                <p id="file-upload-desc" className="text-slate-600 dark:text-slate-300 mt-2">Supports .txt, audio, video, and image files.</p>
                {fileError && <p role="alert" className="text-red-500 dark:text-red-400 font-semibold mt-4 text-sm bg-red-500/10 p-2 rounded-md">{fileError}</p>}
              </div>
        ) : (
             <div className={`relative flex flex-col items-center justify-center w-full p-8 border-2 border-dashed rounded-xl transition-all duration-300 border-slate-400/30 dark:border-slate-600/50 bg-white/10 dark:bg-slate-900/20 backdrop-blur-md`}>
                 <div className="flex items-center gap-4 p-4 bg-white/20 dark:bg-slate-800/40 rounded-full mb-4" aria-label="Supported URL sources">
                    <GlobeIcon />
                    <YoutubeIcon />
                    <TedIcon />
                    <ArchiveOrgIcon />
                 </div>
                 <p className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4" id="url-heading">Analyze Content from a URL</p>
                 <form onSubmit={handleUrlFormSubmit} className="w-full max-w-md flex items-center gap-2" aria-labelledby="url-heading">
                    <input
                        type="url"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        placeholder="Article, YouTube, TED, or Archive.org URL"
                        required
                        aria-label="URL to analyze"
                        aria-describedby="url-desc"
                        className="flex-grow bg-white/20 dark:bg-slate-800/40 border border-slate-400/30 dark:border-slate-600/50 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-primary text-slate-800 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400"
                        title="Enter a URL to an article, YouTube video, TED Talk, or Internet Archive page. Note: Scraping generic articles may be blocked by the site's CORS policy."
                    />
                    <button type="submit" className="px-6 py-2 bg-brand-primary hover:bg-sky-600 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105" title="Start analysis of the URL">Analyze</button>
                 </form>
                 <p id="url-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-6">Supports articles, YouTube, TED Talks, and Internet Archive pages (text, audio, video). Web scraping may be blocked by some sites.</p>
             </div>
        )}
      </>
    );
  };
  
  const hasStagedFiles = stagedFiles.length > 0;

  return (
    <div className="w-full max-w-3xl text-center">
      <fieldset className="p-0 border-0">
        <legend className="sr-only">Select Project Type</legend>
        <div className="flex justify-center p-1 bg-white/10 dark:bg-slate-900/30 backdrop-blur-md border border-white/20 dark:border-slate-700/50 rounded-full mb-6 max-w-sm mx-auto">
            <button onClick={() => { setProjectType('single'); setFileError(null); }} title="Analyze a single file or URL" className={`w-1/2 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${projectType === 'single' ? 'bg-brand-primary text-white shadow-lg' : 'text-slate-600 dark:text-slate-300 hover:bg-white/20 dark:hover:bg-slate-700/50'}`}>Single Source</button>
            <button onClick={() => { setProjectType('archive'); setFileError(null); }} title="Analyze a collection of files to find cross-document connections" className={`w-1/2 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${projectType === 'archive' ? 'bg-brand-primary text-white shadow-lg' : 'text-slate-600 dark:text-slate-300 hover:bg-white/20 dark:hover:bg-slate-700/50'}`}>Archival Collection</button>
        </div>
      </fieldset>

      <div className="my-6 text-left max-w-md mx-auto">
        <fieldset className="p-0 border-0">
            <legend className="flex items-center justify-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                <GaugeIcon />
                Analysis Depth
            </legend>
            <div className="flex bg-white/10 dark:bg-slate-900/30 backdrop-blur-md border border-white/20 dark:border-slate-700/50 rounded-lg p-1">
                <button 
                    onClick={() => setAnalysisMode('standard')}
                    title="Deep, comprehensive analysis including fact-checking for audio."
                    className={`w-1/2 px-3 py-2 text-sm font-semibold rounded-md transition-colors ${analysisMode === 'standard' ? 'bg-brand-primary text-white shadow-lg' : 'text-slate-600 dark:text-slate-300 hover:bg-white/20 dark:hover:bg-slate-700/50'}`}
                >
                    Standard
                    <span className="block text-xs opacity-80 font-normal">Comprehensive & in-depth</span>
                </button>
                <button 
                    onClick={() => setAnalysisMode('express')}
                    title="Faster, high-level overview analysis."
                    className={`w-1/2 px-3 py-2 text-sm font-semibold rounded-md transition-colors ${analysisMode === 'express' ? 'bg-brand-primary text-white shadow-lg' : 'text-slate-600 dark:text-slate-300 hover:bg-white/20 dark:hover:bg-slate-700/50'}`}
                >
                    Express
                    <span className="block text-xs opacity-80 font-normal">Faster & cost-effective</span>
                </button>
            </div>
        </fieldset>
      </div>
      
      {projectType === 'single' ? renderSingleFileContent() : (
          <>
            <div
              className={`relative flex flex-col items-center justify-center w-full p-8 border-2 border-dashed rounded-xl transition-all duration-300 ${dragDropClasses} bg-white/10 dark:bg-slate-900/20 backdrop-blur-md`}
              onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDragOver={handleDragOver} onDrop={handleDrop}
              aria-label="File upload area for archive. Drag and drop, paste, or click to browse."
              title="Drop one or more files to add them to the staged collection."
            >
              <input type="file" id="file-upload-archive" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileChange} accept={acceptedFileString} multiple aria-describedby="file-upload-archive-desc"/>
              <div className="p-4 bg-white/20 dark:bg-slate-800/40 rounded-full mb-4"><ArchiveIcon /></div>
              {hasStagedFiles ? (
                  <>
                      <p className="text-xl font-semibold text-slate-800 dark:text-slate-100">Add more files</p>
                      <p id="file-upload-archive-desc" className="text-slate-600 dark:text-slate-300 mt-2">
                        You can drag & drop, paste, or <label htmlFor="file-upload-archive" className="text-brand-primary font-medium cursor-pointer hover:underline">click to upload</label> more files.
                      </p>
                  </>
              ) : (
                  <>
                    <p className="text-xl font-semibold text-slate-800 dark:text-slate-100">Drag & drop, paste, or <label htmlFor="file-upload-archive" className="text-brand-primary font-medium cursor-pointer hover:underline">click to upload</label></p>
                    <p id="file-upload-archive-desc" className="text-slate-600 dark:text-slate-300 mt-2">Supports .txt, audio, video, and image files.</p>
                  </>
              )}
              {fileError && <p role="alert" className="text-red-500 dark:text-red-400 font-semibold mt-4 text-sm bg-red-500/10 p-2 rounded-md">{fileError}</p>}
            </div>
            
            <div className="mt-8 text-left">
                <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-4">Staged Files ({stagedFiles.length})</h3>
                {hasStagedFiles ? (
                  <div className="space-y-3 max-h-60 overflow-y-auto bg-white/10 dark:bg-slate-900/20 backdrop-blur-sm p-4 rounded-lg">
                      {stagedFiles.map((file, index) => (
                          <div 
                            key={`${file.name}-${file.lastModified}`} 
                            onClick={() => handleToggleMarkForRemoval(file)}
                            className={`flex items-center justify-between bg-white/20 dark:bg-slate-800/40 p-3 rounded-lg animate-fade-in-fast cursor-pointer group task-item ${markedForRemoval.has(file) ? 'completed' : ''}`}
                            title="Click to mark for removal, click again to remove."
                          >
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className="text-slate-500 dark:text-slate-400 flex-shrink-0">{getFileIcon(file.type)}</div>
                                <div className="flex-grow overflow-hidden">
                                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate task-item-text" title={file.name}>{file.name}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-500">{formatFileSize(file.size)}</p>
                                </div>
                            </div>
                             <div className={`text-sm font-semibold transition-opacity ${markedForRemoval.has(file) ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`}>
                                {markedForRemoval.has(file) ? 'Click again to remove' : 'Mark for removal'}
                            </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 dark:text-slate-500 text-center py-4">No files added yet.</p>
                )}
                <div className="text-center mt-6">
                  <button 
                      onClick={() => onArchiveSubmit(stagedFiles, analysisMode)} 
                      disabled={stagedFiles.length === 0}
                      className="px-8 py-3 bg-brand-primary hover:bg-sky-600 text-white font-bold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 disabled:bg-slate-500 dark:disabled:bg-slate-600 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-md"
                      title={stagedFiles.length > 0 ? "Start analysis on the collection of staged files" : "Add files to enable analysis"}
                  >
                      Analyze Collection
                  </button>
                </div>
            </div>
          </>
      )}
    </div>
  );
};