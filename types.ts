// --- Analysis Mode ---
export type AnalysisMode = 'standard' | 'express';

// FIX: Define AnalysisType here to be used globally and avoid circular dependencies.
export type AnalysisType = 'publication' | 'narrative' | 'audio' | 'video' | 'image' | 'archive';

// --- Publication Analysis Types ---
export interface Argument {
  point: string;
  supportingEvidence: string[];
  counterArguments?: string[];
}

export interface ArgumentMap {
  mainThesis: string;
  primaryArguments: Argument[];
}

export interface Summary {
  thesis: string;
  methodology: string;
  results: string;
}

export interface GlossaryItem {
  term: string;
  definition: string;
}

export interface PublicationAnalysisResult {
  type: 'publication';
  originalText: string;
  argumentMap: ArgumentMap;
  summary: Summary;
  glossary: GlossaryItem[];
}

// --- Narrative Analysis Types ---
export interface CharacterProfile {
  name: string;
  description: string;
}

export interface NarrativeTheme {
  title: string;
  explanation: string;
}

export interface NarrativeAnalysisResult {
  type: 'narrative';
  originalText: string;
  plotSummary: string;
  characters: CharacterProfile[];
  themes: NarrativeTheme[];
}

// Discriminated union for all text-based analysis
export type TextAnalysisResult = PublicationAnalysisResult | NarrativeAnalysisResult;


// --- Audio Analysis Types ---
export interface TranscriptEntry {
    speaker: string;
    timestamp: string; // HH:MM:SS
    text: string;
}

export interface GroundingChunk {
    web: {
        uri: string;
        title: string;
    }
}

export interface FactCheckResult {
    claim: string;
    verification: string;
    sources: GroundingChunk[];
}

export interface ThematicSegment {
    topic: string;
    summary: string;
    timestamp_start: string; // HH:MM:SS
}

export interface SentimentAnalysis {
    overallSentiment: string; // e.g., Positive, Negative, Neutral, Mixed
    tone: string; // e.g., Professional, Casual, Humorous, Tense
    summary: string;
}

export interface AudioAnalysisResult {
    type: 'audio';
    transcript: TranscriptEntry[];
    factChecks?: FactCheckResult[];
    thematicSegments?: ThematicSegment[];
    sentimentAnalysis?: SentimentAnalysis;
    youtubeUrl?: string;
    tedTalkUrl?: string;
    archiveOrgUrl?: string;
    fileUrl?: string; // For local audio file playback
}

// --- Video Narrative Analysis Types ---
export interface PlotPoint {
    timestamp: string; // HH:MM:SS
    event: string;
    description: string;
    charactersInvolved: string[];
}

export interface CharacterArc {
    name: string;
    arc_summary: string;
}

export interface ThemeInstance {
    timestamp: string; // HH:MM:SS
    description: string;
}

export interface VideoTheme {
    theme: string;
    instances: ThemeInstance[];
}

export interface VideoNarrativeAnalysisResult {
    type: 'video';
    plot_points: PlotPoint[];
    characters: CharacterArc[];
    themes: VideoTheme[];
    videoUrl?: string; // For local video file playback
}

// --- Archive Analysis Types ---
export interface TimelineEvent {
    date: string;
    event: string;
    description: string;
    sourceDocument: string;
}

export interface Mention {
    document: string;
    context: string;
}

export interface Entity {
    name: string;
    type: string; // e.g., 'Person', 'Organization', 'Location'
    mentions: Mention[];
}

export interface ThematicConnection {
    theme: string;
    description: string;
    connectingDocuments: {
        document: string;
        context: string;
    }[];
}

export interface ArchiveAnalysisResult {
  type: 'archive';
  timeline: TimelineEvent[];
  entities: Entity[];
  connections: ThematicConnection[];
}

// --- Image Analysis Types ---
export interface ImageAnalysisResult {
    type: 'image';
    description: string;
    identifiedObjects: string[];
    extractedText?: string;
    imageUrl?: string; // For local image file display
}

// --- Union for all possible analysis results ---
export type AnalysisResult = TextAnalysisResult | AudioAnalysisResult | VideoNarrativeAnalysisResult | ArchiveAnalysisResult | ImageAnalysisResult;

// --- App Settings ---
export type Theme = 'dark' | 'light';
export type AccentColor = 'sky' | 'indigo' | 'emerald' | 'rose';
export type DefaultAnalysisType = 'single' | 'archive';

export interface Settings {
    theme: Theme;
    accentColor: AccentColor;
    disableAnimations: boolean;
    highContrastMode: boolean;
    fontSize: number; // Stored as base pixel value, e.g., 16
    defaultAnalysisType: DefaultAnalysisType;
    defaultAnalysisMode: AnalysisMode;
    chatShowSuggestions: boolean;
}

// --- Archive Types ---

export interface ArchivedAnalysisItem {
  id: string; // Unique ID
  title: string; // User-editable title
  notes: string; // User-editable notes, supports Markdown
  fileName: string; // Original file/project name
  analysisType: AnalysisType;
  analysisResult: AnalysisResult;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  fileNames?: string[]; // For archive type
  mediaUrl?: string; // For local media files
}

// --- Command Palette ---
export interface Command {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
  section?: string;
}