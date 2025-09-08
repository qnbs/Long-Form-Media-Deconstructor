import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import type { VideoNarrativeAnalysisResult, PlotPoint } from '../types';
import { TimelineIcon, ThemeIcon, ChatIcon, CharactersIcon, PlayIcon, PauseIcon } from './IconComponents';
import { ChatInterface } from './ChatInterface';
import { DashboardHeader } from './DashboardHeader';
import { useAppContext } from './AppContext';

// Utility to convert HH:MM:SS to seconds
const timeToSeconds = (time: string): number => {
    const parts = time.split(':').map(Number);
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    return 0;
};

const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '00:00';
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = date.getUTCSeconds().toString().padStart(2, '0');
    if (hh) {
        return `${hh}:${mm.toString().padStart(2, '0')}:${ss}`;
    }
    return `${mm}:${ss}`;
};

interface VideoNarrativeDashboardProps {
    result: VideoNarrativeAnalysisResult;
    fileName: string;
}

export const VideoNarrativeDashboard: React.FC<VideoNarrativeDashboardProps> = ({ result, fileName }) => {
  const { resetAnalysis } = useAppContext();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<string>('all');
  const chatContext = JSON.stringify(result, null, 2);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [controlsVisible, setControlsVisible] = useState(true);
  const controlsTimeoutRef = useRef<number | null>(null);

  const showControls = useCallback(() => {
    if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
    }
    setControlsVisible(true);
    if (isPlaying) {
        controlsTimeoutRef.current = window.setTimeout(() => {
            setControlsVisible(false);
        }, 3000);
    }
  }, [isPlaying]);

  useEffect(() => {
    showControls();
  }, [isPlaying, showControls]);

  useEffect(() => {
    return () => {
        if (controlsTimeoutRef.current) {
            clearTimeout(controlsTimeoutRef.current);
        }
    };
  }, []);


  const handleSeek = (time: string) => {
    if (videoRef.current) {
        const seconds = timeToSeconds(time);
        videoRef.current.currentTime = seconds;
        setCurrentTime(seconds);
        if(videoRef.current.paused) {
            videoRef.current.play();
        }
    }
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      videoRef.current.paused ? videoRef.current.play() : videoRef.current.pause();
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
        const time = Number(e.target.value);
        videoRef.current.currentTime = time;
        setCurrentTime(time);
    }
  };

  const filteredPlotPoints = useMemo(() => {
    if (selectedCharacter === 'all') {
      return result.plot_points;
    }
    return result.plot_points.filter(p => p.charactersInvolved.includes(selectedCharacter));
  }, [selectedCharacter, result.plot_points]);


  return (
    <div className="w-full animate-fade-in max-w-7xl">
        <DashboardHeader
            fileName={fileName}
            analysisType="video"
            onReset={resetAnalysis}
            analysisResult={result}
        />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mt-8">
            <main className="lg:col-span-3 space-y-8">
                 <div 
                    className="sticky top-24 bg-black rounded-xl shadow-lg z-10 ring-1 ring-inset ring-slate-700/50 relative"
                    onMouseMove={showControls}
                    onMouseLeave={() => { if (isPlaying) setControlsVisible(false); }}
                 >
                    <video 
                        ref={videoRef} 
                        src={result.videoUrl} 
                        className="w-full rounded-md"
                        onLoadedMetadata={handleLoadedMetadata}
                        onTimeUpdate={handleTimeUpdate}
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                        onEnded={() => setIsPlaying(false)}
                        onClick={handlePlayPause}
                    />
                    <div className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent rounded-b-md transition-opacity duration-300 ${controlsVisible ? 'opacity-100' : 'opacity-0'}`}>
                        <div className="flex items-center gap-3 text-white">
                            <button onClick={handlePlayPause} title={isPlaying ? "Pause" : "Play"}>
                                {isPlaying ? <PauseIcon /> : <PlayIcon />}
                            </button>
                            <span className="text-xs font-mono flex-shrink-0">{formatTime(currentTime)}</span>
                            <input
                                type="range"
                                min="0"
                                max={duration || 1}
                                value={currentTime}
                                onChange={handleSeekChange}
                                className="w-full h-1.5 bg-white/30 rounded-lg appearance-none cursor-pointer accent-brand-primary"
                                title="Seek video track"
                            />
                            <span className="text-xs font-mono flex-shrink-0">{formatTime(duration)}</span>
                        </div>
                    </div>
                </div>
                 <section>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 text-brand-primary">
                        <div className="flex items-center gap-3">
                            <TimelineIcon />
                            <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">Interactive Timeline</h2>
                        </div>
                        <div className="flex items-center gap-2">
                             <label htmlFor="char-filter" className="text-sm font-medium text-slate-700 dark:text-slate-300">Filter by Character:</label>
                             <select id="char-filter" value={selectedCharacter} onChange={e => setSelectedCharacter(e.target.value)} className="bg-white/20 dark:bg-slate-800/40 border border-slate-300/50 dark:border-slate-600/50 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary">
                                 <option value="all">All Characters</option>
                                 {result.characters.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                             </select>
                        </div>
                    </div>
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                       {filteredPlotPoints.map((point, index) => (
                         <div key={index} className="flex gap-4 items-start">
                            <button onClick={() => handleSeek(point.timestamp)} title={`Jump to ${point.timestamp}`} className="text-sm text-slate-500 dark:text-slate-400 font-mono flex-shrink-0 pt-1 hover:text-brand-primary transition-colors">[{point.timestamp}]</button>
                            <div className="bg-white/10 dark:bg-slate-900/20 backdrop-blur-lg border border-white/20 dark:border-slate-700/50 p-4 rounded-lg flex-grow ring-1 ring-inset ring-white/10 dark:ring-slate-700/50">
                                <h3 className="font-bold text-slate-800 dark:text-slate-100">{point.event}</h3>
                                <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">{point.description}</p>
                                {point.charactersInvolved.length > 0 && (
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                                        <span className="font-semibold">Characters:</span> {point.charactersInvolved.join(', ')}
                                    </p>
                                )}
                             </div>
                         </div>
                       ))}
                    </div>
                </section>
            </main>
            <aside className="lg:col-span-2 space-y-8">
                <section>
                    <div className="flex items-center gap-3 mb-4 text-brand-primary">
                        <CharactersIcon />
                        <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">Character Arcs</h2>
                    </div>
                    <div className="space-y-4 max-h-[45vh] overflow-y-auto pr-2">
                        {result.characters.map((char, index) => (
                            <div key={index} className="bg-white/10 dark:bg-slate-900/20 backdrop-blur-lg border border-white/20 dark:border-slate-700/50 p-4 rounded-lg ring-1 ring-inset ring-white/10 dark:ring-slate-700/50">
                                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">{char.name}</h3>
                                <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">{char.arc_summary}</p>
                            </div>
                        ))}
                    </div>
                </section>
                 <section>
                    <div className="flex items-center gap-3 mb-4 text-brand-primary">
                        <ThemeIcon />
                        <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">Thematic Analysis</h2>
                    </div>
                     <div className="space-y-4 max-h-[45vh] overflow-y-auto pr-2">
                        {result.themes.map((theme, index) => (
                             <div key={index} className="bg-white/10 dark:bg-slate-900/20 backdrop-blur-lg border border-white/20 dark:border-slate-700/50 p-4 rounded-lg ring-1 ring-inset ring-white/10 dark:ring-slate-700/50">
                                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">{theme.theme}</h3>
                                <ul className="mt-2 space-y-2">
                                    {theme.instances.map((instance, i) => (
                                        <li key={i} className="text-sm flex gap-2 items-start">
                                            <button onClick={() => handleSeek(instance.timestamp)} title={`Jump to ${instance.timestamp}`} className="text-xs text-slate-500 dark:text-slate-400 font-mono flex-shrink-0 pt-1 hover:text-brand-primary transition-colors">[{instance.timestamp}]</button>
                                            <p className="text-slate-600 dark:text-slate-300">{instance.description}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>
            </aside>
        </div>

         <section className="mt-8">
            <div className="flex items-center gap-3 mb-4 text-brand-primary">
                <ChatIcon />
                <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">Conversational Query</h2>
            </div>
            <ChatInterface documentContext={chatContext} contextType="analysis" />
        </section>
    </div>
  );
};