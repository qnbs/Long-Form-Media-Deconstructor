

import React, { useState, useRef, useEffect, useMemo } from 'react';
import type { VideoNarrativeAnalysisResult, PlotPoint } from '../types';
import { TimelineIcon, ThemeIcon, ChatIcon, CharactersIcon } from './IconComponents';
import { ChatInterface } from './ChatInterface';
import { DashboardHeader } from './DashboardHeader';
import { useAppContext } from './AppContext';

// Utility to convert HH:MM:SS to seconds
const timeToSeconds = (time: string): number => {
    const parts = time.split(':').map(Number);
    if (parts.length === 3) {
        return parts[0] * 3600 + parts[1] * 60 + parts[2];
    }
    return 0;
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

  const handleSeek = (time: string) => {
    if (videoRef.current) {
        videoRef.current.currentTime = timeToSeconds(time);
        if(videoRef.current.paused) {
            videoRef.current.play();
        }
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
                 <div className="sticky top-4 bg-slate-200/80 dark:bg-slate-800/80 backdrop-blur-md p-4 rounded-lg shadow-lg z-10 border border-slate-300 dark:border-slate-700">
                    <video ref={videoRef} src={result.videoUrl} controls className="w-full rounded-md" />
                </div>
                 <section>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 text-brand-primary">
                        <div className="flex items-center gap-3">
                            <TimelineIcon />
                            <h2 className="text-2xl font-semibold">Interactive Timeline</h2>
                        </div>
                        <div className="flex items-center gap-2">
                             <label htmlFor="char-filter" className="text-sm font-medium text-slate-700 dark:text-slate-300">Filter by Character:</label>
                             <select id="char-filter" value={selectedCharacter} onChange={e => setSelectedCharacter(e.target.value)} className="bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary">
                                 <option value="all">All Characters</option>
                                 {result.characters.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                             </select>
                        </div>
                    </div>
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                       {filteredPlotPoints.map((point, index) => (
                         <div key={index} className="flex gap-4 items-start">
                            <button onClick={() => handleSeek(point.timestamp)} className="text-sm text-slate-500 font-mono flex-shrink-0 pt-1 hover:text-brand-primary transition-colors">[{point.timestamp}]</button>
                            <div className="bg-slate-200/70 dark:bg-slate-800/70 p-4 rounded-lg border border-slate-300 dark:border-slate-700 flex-grow">
                                <h3 className="font-bold text-slate-800 dark:text-slate-200">{point.event}</h3>
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
                        <h2 className="text-2xl font-semibold">Character Arcs</h2>
                    </div>
                    <div className="space-y-4 max-h-[45vh] overflow-y-auto pr-2">
                        {result.characters.map((char, index) => (
                            <div key={index} className="bg-slate-200/70 dark:bg-slate-800/70 p-4 rounded-lg border border-slate-300 dark:border-slate-700">
                                <h3 className="font-bold text-slate-800 dark:text-slate-200 text-lg">{char.name}</h3>
                                <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">{char.arc_summary}</p>
                            </div>
                        ))}
                    </div>
                </section>
                 <section>
                    <div className="flex items-center gap-3 mb-4 text-brand-primary">
                        <ThemeIcon />
                        <h2 className="text-2xl font-semibold">Thematic Analysis</h2>
                    </div>
                     <div className="space-y-4 max-h-[45vh] overflow-y-auto pr-2">
                        {result.themes.map((theme, index) => (
                             <div key={index} className="bg-slate-200/70 dark:bg-slate-800/70 p-4 rounded-lg border border-slate-300 dark:border-slate-700">
                                <h3 className="font-bold text-slate-800 dark:text-slate-200 text-lg">{theme.theme}</h3>
                                <ul className="mt-2 space-y-2">
                                    {theme.instances.map((instance, i) => (
                                        <li key={i} className="text-sm flex gap-2 items-start">
                                            <button onClick={() => handleSeek(instance.timestamp)} className="text-xs text-slate-500 font-mono flex-shrink-0 pt-1 hover:text-brand-primary transition-colors">[{instance.timestamp}]</button>
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
                <h2 className="text-2xl font-semibold">Conversational Query</h2>
            </div>
            <ChatInterface documentContext={chatContext} contextType="analysis" />
        </section>
    </div>
  );
};