
import React, { useCallback, useState } from 'react';
import { UploadIcon, DocumentIcon, ArchiveIcon, XIcon, GlobeIcon, YoutubeIcon, TedIcon, ArchiveOrgIcon, GaugeIcon } from './IconComponents';
import type { AnalysisMode, DefaultAnalysisType } from '../types';

interface FileUploadProps {
  onSingleFileSelect: (file: File, mode: AnalysisMode) => void;
  onArchiveSubmit: (files: File[], mode: AnalysisMode) => void;
  onUrlSubmit: (url: string, mode: AnalysisMode) => void;
  defaultAnalysisType: DefaultAnalysisType;
  defaultAnalysisMode: AnalysisMode;
}

const acceptedFiles = ".txt,audio/*,video/mp4,video/quicktime,image/jpeg,image/png";

export const FileUpload: React.FC<FileUploadProps> = ({ onSingleFileSelect, onArchiveSubmit, onUrlSubmit, defaultAnalysisType, defaultAnalysisMode }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [projectType, setProjectType] = useState<'single' | 'archive'>(defaultAnalysisType);
  const [stagedFiles, setStagedFiles] = useState<File[]>([]);
  const [analysisMode, setAnalysisMode] = useState<AnalysisMode>(defaultAnalysisMode);
  const [singleInputMode, setSingleInputMode] = useState<'upload' | 'url'>('upload');
  const [urlInput, setUrlInput] = useState('');

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    if (projectType === 'single') {
        onSingleFileSelect(files[0], analysisMode);
    } else {
        setStagedFiles(prev => {
            const newFiles = Array.from(files);
            const allFiles = [...prev, ...newFiles];
            // Remove duplicates
            return allFiles.filter((file, index, self) => 
                index === self.findIndex(f => f.name === file.name && f.size === file.size)
            );
        });
    }
  };

  const removeStagedFile = (fileToRemove: File) => {
      setStagedFiles(prev => prev.filter(file => file !== fileToRemove));
  };
  
  const handleUrlFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedUrl = urlInput.trim();
    if (trimmedUrl) {
      onUrlSubmit(trimmedUrl, analysisMode);
    }
  };

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); }, []);
  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); }, []);
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); }, []);
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); e.stopPropagation(); setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, [projectType, analysisMode]);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => { handleFiles(e.target.files); };
  const dragDropClasses = isDragging 
    ? 'border-brand-primary bg-slate-200 dark:bg-slate-700/50' 
    : 'border-slate-400 dark:border-slate-600 hover:border-brand-primary';

  const renderSingleFileContent = () => {
    return (
      <>
        <div className="flex justify-center p-1 bg-slate-200 dark:bg-slate-800 rounded-lg mb-6 max-w-xs mx-auto" role="tablist" aria-label="Input mode">
            <button onClick={() => setSingleInputMode('upload')} role="tab" aria-selected={singleInputMode === 'upload'} className={`w-1/2 px-4 py-2 rounded-md text-sm font-semibold transition-colors ${singleInputMode === 'upload' ? 'bg-brand-secondary text-white' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-700'}`}>Upload File</button>
            <button onClick={() => setSingleInputMode('url')} role="tab" aria-selected={singleInputMode === 'url'} className={`w-1/2 px-4 py-2 rounded-md text-sm font-semibold transition-colors ${singleInputMode === 'url' ? 'bg-brand-secondary text-white' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-700'}`}>From URL</button>
        </div>
        {singleInputMode === 'upload' ? (
             <div
                className={`relative flex flex-col items-center justify-center w-full p-8 border-2 border-dashed rounded-xl transition-colors duration-300 ${dragDropClasses}`}
                onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDragOver={handleDragOver} onDrop={handleDrop}
                aria-label="File upload area. Drag and drop a file or click to browse."
              >
                <input type="file" id="file-upload" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileChange} accept={acceptedFiles} multiple={false} aria-describedby="file-upload-desc" />
                <div className="p-4 bg-slate-200 dark:bg-slate-700 rounded-full mb-4"><DocumentIcon /></div>
                <p className="text-xl font-semibold text-slate-800 dark:text-slate-200">Drag & drop your file here</p>
                <p className="text-slate-500 dark:text-slate-400 mt-2">or <label htmlFor="file-upload" className="text-brand-primary font-medium cursor-pointer hover:underline">click to browse</label></p>
                <p id="file-upload-desc" className="text-xs text-slate-400 dark:text-slate-500 mt-6">Supports .txt, audio, video, and image files.</p>
              </div>
        ) : (
             <div className="relative flex flex-col items-center justify-center w-full p-8 border-2 border-dashed border-slate-400 dark:border-slate-600 rounded-xl">
                 <div className="flex items-center gap-4 p-4 bg-slate-200 dark:bg-slate-700 rounded-full mb-4" aria-label="Supported URL sources">
                    <GlobeIcon />
                    <YoutubeIcon />
                    <TedIcon />
                    <ArchiveOrgIcon />
                 </div>
                 <p className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4" id="url-heading">Analyze Content from a URL</p>
                 <form onSubmit={handleUrlFormSubmit} className="w-full max-w-md flex items-center gap-2" aria-labelledby="url-heading">
                    <input
                        type="url"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        placeholder="Article, YouTube, TED, or Archive.org URL"
                        required
                        aria-label="URL to analyze"
                        aria-describedby="url-desc"
                        className="flex-grow bg-slate-200 dark:bg-slate-700 border border-slate-400 dark:border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-primary text-slate-800 dark:text-slate-200"
                    />
                    <button type="submit" className="px-6 py-2 bg-brand-primary hover:bg-sky-600 text-white font-semibold rounded-lg shadow-md transition-colors duration-300">Analyze</button>
                 </form>
                 <p id="url-desc" className="text-xs text-slate-400 dark:text-slate-500 mt-6">Supports articles, YouTube, TED Talks, and Internet Archive pages (text, audio, video). Web scraping may be blocked by some sites.</p>
             </div>
        )}
      </>
    );
  };

  return (
    <div className="w-full max-w-3xl text-center">
      <fieldset className="p-0 border-0">
        <legend className="sr-only">Select Project Type</legend>
        <div className="flex justify-center p-1 bg-slate-200 dark:bg-slate-800 rounded-full mb-6 max-w-sm mx-auto">
            <button onClick={() => setProjectType('single')} className={`w-1/2 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${projectType === 'single' ? 'bg-brand-primary text-white' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-700'}`}>Single Source</button>
            <button onClick={() => setProjectType('archive')} className={`w-1/2 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${projectType === 'archive' ? 'bg-brand-primary text-white' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-700'}`}>Archival Collection</button>
        </div>
      </fieldset>

      <div className="my-6 text-left max-w-md mx-auto">
        <fieldset className="p-0 border-0">
            <legend className="flex items-center justify-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                <GaugeIcon />
                Analysis Depth
            </legend>
            <div className="flex bg-slate-200 dark:bg-slate-800 rounded-lg p-1">
                <button 
                    onClick={() => setAnalysisMode('standard')}
                    className={`w-1/2 px-3 py-2 text-sm font-semibold rounded-md transition-colors ${analysisMode === 'standard' ? 'bg-brand-primary text-white' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-700'}`}
                >
                    Standard
                    <span className="block text-xs opacity-80 font-normal">Comprehensive & in-depth</span>
                </button>
                <button 
                    onClick={() => setAnalysisMode('express')}
                    className={`w-1/2 px-3 py-2 text-sm font-semibold rounded-md transition-colors ${analysisMode === 'express' ? 'bg-brand-primary text-white' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-700'}`}
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
              className={`relative flex flex-col items-center justify-center w-full p-8 border-2 border-dashed rounded-xl transition-colors duration-300 ${dragDropClasses}`}
              onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDragOver={handleDragOver} onDrop={handleDrop}
              aria-label="File upload area for archive. Drag and drop multiple files or click to browse."
            >
              <input type="file" id="file-upload-archive" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileChange} accept={acceptedFiles} multiple aria-describedby="file-upload-archive-desc"/>
              <div className="p-4 bg-slate-200 dark:bg-slate-700 rounded-full mb-4"><ArchiveIcon /></div>
              <p className="text-xl font-semibold text-slate-800 dark:text-slate-200">Drag & drop your files here</p>
              <p className="text-slate-500 dark:text-slate-400 mt-2">or <label htmlFor="file-upload-archive" className="text-brand-primary font-medium cursor-pointer hover:underline">click to browse</label></p>
              <p id="file-upload-archive-desc" className="text-xs text-slate-400 dark:text-slate-500 mt-6">Supports .txt, audio, video, and image files.</p>
            </div>
            
            <div className="mt-8 text-left">
                <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-4">Staged Files ({stagedFiles.length})</h3>
                {stagedFiles.length > 0 ? (
                  <div className="space-y-2 max-h-60 overflow-y-auto bg-slate-200/50 dark:bg-slate-800/50 p-4 rounded-lg">
                      {stagedFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-slate-300 dark:bg-slate-700 p-2 rounded">
                              <p className="text-sm text-slate-800 dark:text-slate-200 truncate">{file.name}</p>
                              <button onClick={() => removeStagedFile(file)} className="p-1 text-slate-500 dark:text-slate-400 hover:text-red-400" aria-label={`Remove ${file.name} from staged files`}>
                                <XIcon />
                              </button>
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
                      className="px-8 py-3 bg-brand-primary hover:bg-sky-600 text-white font-bold rounded-lg shadow-md transition-colors duration-300 disabled:bg-slate-500 dark:disabled:bg-slate-600 disabled:cursor-not-allowed"
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