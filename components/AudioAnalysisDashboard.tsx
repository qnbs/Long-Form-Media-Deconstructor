import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import type { AudioAnalysisResult } from '../types';
import { ThemeIcon, SentimentIcon, PlayIcon, PauseIcon, ChatIcon, FactCheckIcon, TranscriptIcon } from './IconComponents';
import { FactCheckCard } from './FactCheckCard';
import { ChatInterface } from './ChatInterface';
import { DashboardHeader } from './DashboardHeader';
import { useAppContext } from './AppContext';

// --- Media Player Sub-Component ---

const getYouTubeId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
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

interface MediaPlayerProps {
    result: AudioAnalysisResult;
    fileName: string;
    onPlayerReady: (player: any) => void;
    onTimeUpdate: (time: number) => void;
    onStateChange: (isPlaying: boolean) => void;
    onDurationChange: (duration: number) => void;
    currentTime: number;
    duration: number;
    isPlaying: boolean;
    onPlayPause: () => void;
    onSeekChange: (time: number) => void;
}

const CustomControls: React.FC<Pick<MediaPlayerProps, 'isPlaying' | 'currentTime' | 'duration' | 'onPlayPause' | 'onSeekChange'>> = ({ isPlaying, currentTime, duration, onPlayPause, onSeekChange }) => (
    <div className="flex items-center gap-4 text-slate-800 dark:text-slate-200 mt-2">
        <button onClick={onPlayPause} title={isPlaying ? "Pause" : "Play"} className="text-slate-800 dark:text-slate-200">
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>
        <span className="text-sm font-mono flex-shrink-0">{formatTime(currentTime)}</span>
        <input
            type="range"
            min="0"
            max={duration || 1}
            value={currentTime}
            onChange={(e) => onSeekChange(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-400/30 dark:bg-slate-600/50 rounded-lg appearance-none cursor-pointer accent-brand-primary"
            title="Seek audio track"
        />
        <span className="text-sm font-mono flex-shrink-0">{formatTime(duration)}</span>
    </div>
);


const MediaPlayer: React.FC<MediaPlayerProps> = ({ result, fileName, onPlayerReady, onTimeUpdate, onStateChange, onDurationChange, currentTime, duration, isPlaying, onPlayPause, onSeekChange }) => {
    const { youtubeUrl, tedTalkUrl, archiveOrgUrl, fileUrl: audioUrl } = result;
    const audioRef = useRef<HTMLAudioElement>(null);
    const videoId = useMemo(() => youtubeUrl ? getYouTubeId(youtubeUrl) : null, [youtubeUrl]);

    const tedTalkEmbedUrl = useMemo(() => {
        if (!tedTalkUrl) return null;
        const match = tedTalkUrl.match(/ted\.com\/talks\/([^\?#]+)/);
        return match && match[1] ? `https://embed.ted.com/talks/${match[1]}` : null;
    }, [tedTalkUrl]);
    
    const archiveOrgEmbedUrl = useMemo(() => {
        if (!archiveOrgUrl) return null;
        const match = archiveOrgUrl.match(/archive\.org\/(details|embed)\/([^\?#\/]+)/);
        return match && match[2] ? `https://archive.org/embed/${match[2]}` : null;
    }, [archiveOrgUrl]);

    // Effect for local audio player
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        const handleTimeUpdate = () => onTimeUpdate(audio.currentTime);
        const handlePlay = () => onStateChange(true);
        const handlePause = () => onStateChange(false);
        const handleLoadedMetadata = () => onDurationChange(audio.duration);

        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('play', handlePlay);
        audio.addEventListener('pause', handlePause);
        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        
        onPlayerReady(audio);

        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('play', handlePlay);
            audio.removeEventListener('pause', handlePause);
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        };
    }, [audioUrl, onTimeUpdate, onStateChange, onPlayerReady, onDurationChange]);

    // Effect for YouTube player
    useEffect(() => {
        if (!youtubeUrl || !videoId) return;
        let player: any = null;

        const createPlayer = () => {
             if (document.getElementById('youtube-player')) {
                 player = new (window as any).YT.Player('youtube-player', {
                    height: '100%',
                    width: '100%',
                    videoId: videoId,
                    playerVars: { autoplay: 0, controls: 0, modestbranding: 1, rel: 0 },
                    events: { 
                        'onReady': (event: any) => {
                            onPlayerReady(event.target);
                            onDurationChange(event.target.getDuration());
                        },
                        'onStateChange': (event: any) => {
                            const playerState = event.data;
                            onStateChange(playerState === (window as any).YT.PlayerState.PLAYING);
                        }
                    }
                });
             }
        }
        
        if (!(window as any).YT || !(window as any).YT.Player) {
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            document.body.appendChild(tag);
            (window as any).onYouTubeIframeAPIReady = createPlayer;
        } else {
            createPlayer();
        }
        
        return () => {
            player?.destroy();
        }
    }, [youtubeUrl, videoId, onPlayerReady, onStateChange, onDurationChange]);
    
    const showCustomControls = !!(youtubeUrl || audioUrl);
    
    return (
        <div className="bg-white/10 dark:bg-slate-900/30 backdrop-blur-md p-4 rounded-lg">
            {youtubeUrl && videoId && (
                <div className="w-full aspect-video bg-black rounded-md"><div id="youtube-player" className="w-full h-full" /></div>
            )}
            {tedTalkEmbedUrl && (
                 <div className="w-full aspect-video bg-black rounded-md"><iframe src={tedTalkEmbedUrl} className="w-full h-full" frameBorder="0" scrolling="no" allowFullScreen title={fileName}></iframe></div>
            )}
            {archiveOrgEmbedUrl && (
                 <div className="w-full aspect-video bg-black rounded-md"><iframe src={archiveOrgEmbedUrl} className="w-full h-full" frameBorder="0" allowFullScreen title={fileName}></iframe></div>
            )}
            {audioUrl && (
                <audio ref={audioRef} src={audioUrl} className="hidden" />
            )}
             {showCustomControls && (
                <CustomControls
                    isPlaying={isPlaying}
                    currentTime={currentTime}
                    duration={duration}
                    onPlayPause={onPlayPause}
                    onSeekChange={onSeekChange}
                />
            )}
        </div>
    );
};


// --- Main Dashboard Component ---

const timeToSeconds = (time: string): number => {
    const parts = time.split(':').map(Number);
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    return 0;
};

interface AudioAnalysisDashboardProps {
    result: AudioAnalysisResult;
    fileName: string;
}

export const AudioAnalysisDashboard: React.FC<AudioAnalysisDashboardProps> = ({ result, fileName }) => {
  const { resetAnalysis } = useAppContext();
  const [assignedColors, setAssignedColors] = useState<Map<string, string>>(new Map());
  const playerRef = useRef<any>(null);
  const timeUpdateInterval = useRef<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const chatContext = JSON.stringify(result, null, 2);

  // Only local audio and YouTube videos can be controlled for seeking.
  const isSeekable = !!(result.fileUrl || result.youtubeUrl);

  useEffect(() => {
    const colors = new Map<string, string>();
    const speakerColorClasses = ['text-sky-500', 'text-emerald-500', 'text-amber-500', 'text-rose-500', 'text-violet-500'];
    result.transcript.forEach((entry, i) => {
        if (!colors.has(entry.speaker)) {
            colors.set(entry.speaker, speakerColorClasses[colors.size % speakerColorClasses.length]);
        }
    });
    setAssignedColors(colors);
  }, [result.transcript]);

  const getSpeakerColor = (speaker: string) => assignedColors.get(speaker) || 'text-slate-500 dark:text-slate-400';
  
  const stopTimeUpdater = useCallback(() => {
    if (timeUpdateInterval.current) {
        clearInterval(timeUpdateInterval.current);
        timeUpdateInterval.current = null;
    }
  }, []);

  const startTimeUpdater = useCallback(() => {
    stopTimeUpdater();
    if (playerRef.current && result.youtubeUrl) { // Only needed for YouTube player
        timeUpdateInterval.current = window.setInterval(() => {
            const time = playerRef.current?.getCurrentTime();
            if (typeof time === 'number') {
                setCurrentTime(time);
            }
        }, 250);
    }
  }, [stopTimeUpdater, result.youtubeUrl]);

  const handlePlayerReady = useCallback((player: any) => {
      playerRef.current = player;
  }, []);
  
  const handleDurationChange = useCallback((newDuration: number) => {
      if (!isNaN(newDuration) && newDuration > 0) {
          setDuration(newDuration);
      }
  }, []);

  const handleStateChange = useCallback((playing: boolean) => {
      setIsPlaying(playing);
      if (playing) startTimeUpdater();
      else stopTimeUpdater();
  }, [startTimeUpdater, stopTimeUpdater]);

  const handleTimeUpdate = useCallback((time: number) => {
      setCurrentTime(time);
  }, []);

  const handleSeek = (time: string) => {
    const seconds = timeToSeconds(time);
    const player = playerRef.current;
    if (!player) return;

    if (result.youtubeUrl) { // YouTube API
        player.seekTo(seconds, true);
        if (player.getPlayerState() !== 1) player.playVideo();
    } else if (result.fileUrl) { // HTMLAudioElement
        player.currentTime = seconds;
        if (player.paused) player.play();
    }
  };
  
   const handlePlayPause = () => {
    const player = playerRef.current;
    if (!player) return;
    if (result.youtubeUrl) {
      const state = player.getPlayerState();
      if (state === 1) player.pauseVideo(); else player.playVideo();
    } else if (result.fileUrl) {
      player.paused ? player.play() : player.pause();
    }
  };

  const handleSeekChange = (newTime: number) => {
    const player = playerRef.current;
    if (!player) return;
    if (result.youtubeUrl) {
      player.seekTo(newTime, true);
    } else if (result.fileUrl) {
      player.currentTime = newTime;
    }
    setCurrentTime(newTime);
  };
  
  const filteredTranscript = result.transcript.filter(entry =>
    entry.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.speaker.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full animate-fade-in max-w-7xl">
      <DashboardHeader
        fileName={fileName}
        analysisType="audio"
        onReset={resetAnalysis}
        analysisResult={result}
      />
      
      <div className="sticky top-24 bg-white/10 dark:bg-slate-900/20 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 p-4 rounded-xl shadow-lg z-10 my-8 ring-1 ring-inset ring-white/10 dark:ring-slate-700/50">
        <MediaPlayer 
            result={result}
            fileName={fileName}
            onPlayerReady={handlePlayerReady}
            onStateChange={handleStateChange}
            onTimeUpdate={handleTimeUpdate}
            onDurationChange={handleDurationChange}
            currentTime={currentTime}
            duration={duration}
            isPlaying={isPlaying}
            onPlayPause={handlePlayPause}
            onSeekChange={handleSeekChange}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <main className="lg:col-span-3 space-y-8">
            <section className="bg-white/10 dark:bg-slate-900/20 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 shadow-lg rounded-xl ring-1 ring-inset ring-white/10 dark:ring-slate-700/50">
                <div className="p-6 border-b-2 border-slate-300/20 dark:border-slate-700/50">
                    <div className="flex items-center gap-3 mb-4 text-brand-primary">
                        <TranscriptIcon />
                        <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100" id="transcript-heading">Interactive Transcript</h2>
                    </div>
                     <input
                        type="text"
                        placeholder="Search transcript..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white/20 dark:bg-slate-800/40 border border-slate-300/50 dark:border-slate-600/50 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-primary placeholder:text-slate-500 dark:placeholder:text-slate-400"
                        aria-label="Search transcript"
                    />
                </div>
                <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto" role="log" aria-labelledby="transcript-heading">
                    {filteredTranscript.map((entry, index) => {
                        const entryStart = timeToSeconds(entry.timestamp);
                        const nextEntryStart = index + 1 < result.transcript.length ? timeToSeconds(result.transcript[index + 1].timestamp) : Infinity;
                        const isActive = currentTime >= entryStart && currentTime < nextEntryStart;
                        
                        return(
                            <div key={index} className={`flex flex-col sm:flex-row gap-2 sm:gap-4 items-start p-2 rounded-md transition-colors duration-300 ${isActive ? 'bg-brand-primary/20' : ''}`}>
                                <button 
                                    onClick={() => handleSeek(entry.timestamp)} 
                                    className={`text-sm text-slate-500 dark:text-slate-400 font-mono flex-shrink-0 w-24 pt-1 text-left ${!isSeekable ? 'cursor-default' : 'hover:text-brand-primary'} transition-colors`}
                                    disabled={!isSeekable}
                                    title={`Jump to ${entry.timestamp}`}
                                    aria-label={`Jump to ${entry.timestamp}`}
                                >
                                    [{entry.timestamp}]
                                </button>
                                <div className="flex-grow">
                                    <p className={`font-semibold ${getSpeakerColor(entry.speaker)}`}>{entry.speaker}:</p>
                                    <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{entry.text}</p>

                                </div>
                            </div>
                        )
                    })}
                    {result.transcript.length === 0 && <p className="text-slate-500 dark:text-slate-400 text-center py-8">No speech detected.</p>}
                     {filteredTranscript.length === 0 && result.transcript.length > 0 && <p className="text-slate-500 dark:text-slate-400 text-center py-8">No results for "{searchQuery}".</p>}
                </div>
            </section>
        </main>
        
        <aside className="lg:col-span-2 space-y-8">
            {result.thematicSegments && result.thematicSegments.length > 0 && (
                <section>
                     <div className="flex items-center gap-3 mb-4 text-brand-primary">
                        <ThemeIcon />
                        <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">Thematic Segments</h2>
                    </div>
                    <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2">
                        {result.thematicSegments.map((segment, index) => (
                             <div key={index} className="bg-white/10 dark:bg-slate-900/20 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 p-4 rounded-lg ring-1 ring-inset ring-white/10 dark:ring-slate-700/50">
                                <h3 className="font-bold text-slate-800 dark:text-slate-200">{segment.topic}</h3>
                                <button 
                                    onClick={() => handleSeek(segment.timestamp_start)} 
                                    className={`text-xs font-mono text-slate-500 dark:text-slate-400 mb-2 ${!isSeekable ? 'cursor-default' : 'hover:text-brand-primary'}`}
                                    disabled={!isSeekable}
                                    title={`Jump to start of segment: ${segment.timestamp_start}`}
                                    aria-label={`Jump to start of segment: ${segment.timestamp_start}`}
                                >
                                    Starts at: {segment.timestamp_start}
                                </button>
                                <p className="text-slate-600 dark:text-slate-300 text-sm">{segment.summary}</p>
                             </div>
                        ))}
                    </div>
                </section>
            )}

            {result.sentimentAnalysis && (
                 <section>
                     <div className="flex items-center gap-3 mb-4 text-brand-primary">
                        <SentimentIcon sentiment={result.sentimentAnalysis.overallSentiment} />
                        <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">Sentiment & Tone</h2>
                    </div>
                    <div className="bg-white/10 dark:bg-slate-900/20 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 p-4 rounded-lg ring-1 ring-inset ring-white/10 dark:ring-slate-700/50">
                        <p className="text-slate-700 dark:text-slate-300"><span className="font-semibold text-slate-900 dark:text-slate-100">Sentiment:</span> {result.sentimentAnalysis.overallSentiment}</p>
                        <p className="text-slate-700 dark:text-slate-300"><span className="font-semibold text-slate-900 dark:text-slate-100">Tone:</span> {result.sentimentAnalysis.tone}</p>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">{result.sentimentAnalysis.summary}</p>
                    </div>
                 </section>
            )}

            {result.factChecks && result.factChecks.length > 0 && (
                <section>
                     <div className="flex items-center gap-3 mb-4 text-brand-primary">
                        <FactCheckIcon />
                        <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">Fact-Checking</h2>
                    </div>
                    <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                        {result.factChecks.map((check, index) => <FactCheckCard key={index} result={check} />)}
                    </div>
                </section>
            )}
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