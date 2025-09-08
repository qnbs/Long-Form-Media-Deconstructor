import React from 'react';

// FIX: Updated props type to React.SVGProps<SVGSVGElement> to allow any valid SVG attribute to be passed.
const IconWrapper: React.FC<React.SVGProps<SVGSVGElement>> = ({ children, className, ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${className || ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
        {children}
    </svg>
);

export const ErrorIcon = () => (
    <IconWrapper>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </IconWrapper>
);

export const HelpIcon = () => (
    <IconWrapper>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </IconWrapper>
);

export const SettingsIcon = () => (
    <IconWrapper>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </IconWrapper>
);

export const ArchiveBoxIcon = () => (
    <IconWrapper>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </IconWrapper>
);

export const PlusIcon = () => (
    <IconWrapper>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </IconWrapper>
);

export const UploadIcon = () => (
    <IconWrapper>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </IconWrapper>
);

export const DocumentIcon = () => (
    <IconWrapper>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </IconWrapper>
);

export const ArchiveIcon = () => (
    <IconWrapper>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
    </IconWrapper>
);

export const XIcon = () => (
    <IconWrapper>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </IconWrapper>
);

export const GlobeIcon = () => (
    <IconWrapper>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h10a2 2 0 002-2v-1a2 2 0 012-2h1.945M7.707 4.293a1 1 0 010 1.414L4 10.414V17a2 2 0 002 2h2a2 2 0 002-2v-2.586a1 1 0 01.293-.707l5.414-5.414a1 1 0 00-1.414-1.414l-5.414 5.414a1 1 0 01-.707.293H8a1 1 0 01-1-1V5.414a1 1 0 01.293-.707z" />
    </IconWrapper>
);

export const YoutubeIcon = () => (
    <IconWrapper>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </IconWrapper>
);

export const TedIcon = () => <div className="font-extrabold text-red-500 text-lg">TED</div>;

export const ArchiveOrgIcon = () => (
    <IconWrapper>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path>
    </IconWrapper>
);

export const GaugeIcon = () => (
    <IconWrapper>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </IconWrapper>
);

export const ChatIcon = () => (
    <IconWrapper>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </IconWrapper>
);

export const CopyIcon = () => (
    <IconWrapper className="h-4 w-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </IconWrapper>
);

export const SummaryIcon = () => (
    <IconWrapper>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </IconWrapper>
);

export const GraphIcon = () => (
    <IconWrapper>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
    </IconWrapper>
);

export const TextContextIcon = () => (
    <IconWrapper>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
    </IconWrapper>
);

export const GlossaryIcon = () => (
    <IconWrapper>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </IconWrapper>
);

export const BrainCircuitIcon = () => (
    <IconWrapper>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6.236a4 4 0 012-3.465l1.123-.668a4 4 0 014.248 0L17.5 2.771a4 4 0 012 3.465V12M9 19c-1.105 0-2-.895-2-2V9a2 2 0 012-2h2.05a4 4 0 002.48-.788l.5-.374a4 4 0 014.44 0l.5.374A4 4 0 0019.95 7H21a2 2 0 012 2v3.5a2.5 2.5 0 01-2.5 2.5h-2.008a4 4 0 00-3.743 2.223L13 19M9 19c-1.105 0-2 .895-2 2s.895 2 2 2" />
    </IconWrapper>
);

export const ThemeIcon = () => (
    <IconWrapper>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
    </IconWrapper>
);

export const SentimentIcon: React.FC<{ sentiment?: string }> = ({ sentiment }) => {
    switch (sentiment?.toLowerCase()) {
        case 'positive':
            return <IconWrapper><path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></IconWrapper>;
        case 'negative':
            return <IconWrapper><path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></IconWrapper>;
        default: // Neutral, Mixed
            return <IconWrapper><path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></IconWrapper>;
    }
};

export const PlayIcon = () => (
    <IconWrapper>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </IconWrapper>
);

export const PauseIcon = () => (
    <IconWrapper>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </IconWrapper>
);

export const FactCheckIcon = () => (
    <IconWrapper>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </IconWrapper>
);

export const TranscriptIcon = () => (
    <IconWrapper>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5h2m-2 2h2m-2 2h2" />
    </IconWrapper>
);

export const LinkIcon = () => (
    <IconWrapper className="h-4 w-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </IconWrapper>
);

export const PlotIcon = () => (
    <IconWrapper>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4" />
    </IconWrapper>
);

export const CharactersIcon = () => (
    <IconWrapper>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </IconWrapper>
);

export const MicroscopeIcon = () => (
    <IconWrapper>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 10L3 3" />
    </IconWrapper>
);

export const FeatherIcon = () => (
    <IconWrapper>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-2.5-2.5L3 19.25l2.5 2.5L20.25 7.5zM15 12l-2.5-2.5" />
    </IconWrapper>
);

export const TimelineIcon = () => (
    <IconWrapper>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </IconWrapper>
);

export const EntityIcon = () => (
    <IconWrapper>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 4v12l-4-2-4 2V4M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </IconWrapper>
);

export const ConnectionIcon = () => (
    <IconWrapper>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 003 0m0 0V9m0 2.5v6a1.5 1.5 0 11-3 0m3-6a1.5 1.5 0 00-3 0m0 0h6m-6 0a1.5 1.5 0 01-3 0m3 0V9m6 5.5V14m0-2.5v-6a1.5 1.5 0 013 0m-3 6a1.5 1.5 0 003 0m0 0V9" />
    </IconWrapper>
);

export const NotesIcon = () => (
    <IconWrapper>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
    </IconWrapper>
);

export const BackIcon = () => (
    <IconWrapper>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </IconWrapper>
);

export const ChevronDownIcon = () => (
    <IconWrapper>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </IconWrapper>
);

export const ContrastIcon = () => (
    <IconWrapper>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </IconWrapper>
);

export const FontSizeIcon = () => (
    <IconWrapper>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h6M6 4v16m-3-8h6m7-4h6m-3 0v12" />
    </IconWrapper>
);

export const KeyboardIcon = () => (
    <IconWrapper>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v17.792M6.375 5.25h11.25m-11.25 4.5h11.25m-11.25 4.5h11.25m-11.25 4.5h11.25M4.125 3.104h15.75c1.233 0 2.25 1.017 2.25 2.25v13.292c0 1.233-1.017 2.25-2.25 2.25H4.125c-1.233 0-2.25-1.017-2.25-2.25V5.354c0-1.233 1.017-2.25 2.25-2.25z" />
    </IconWrapper>
);

export const SyncIcon = () => (
    <IconWrapper>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M4 4l1.5 1.5A9 9 0 0120 12M20 20l-1.5-1.5A9 9 0 004 12" />
    </IconWrapper>
);

export const ImportIcon = () => (
    <IconWrapper>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </IconWrapper>
);

export const DownloadIcon = () => (
    <IconWrapper>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </IconWrapper>
);

export const DescriptionIcon = () => (
    <IconWrapper>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </IconWrapper>
);

export const ObjectsIcon = () => (
    <IconWrapper>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </IconWrapper>
);

export const OcrIcon = () => (
    <IconWrapper>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 0h-4m4 0l-5-5" />
    </IconWrapper>
);

export const PhotoIcon = () => (
    <IconWrapper>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </IconWrapper>
);

export const AudioWaveformIcon = () => (
    <IconWrapper>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h1v4H3v-4zm4 2h1v4H7v-4zm4-4h1v8h-1V8zm4 2h1v4h-1v-4zm4-3h1v6h-1V7z" />
    </IconWrapper>
);

export const FilmIcon = () => (
    <IconWrapper>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4" />
    </IconWrapper>
);

export const SearchIcon = () => (
    <IconWrapper>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </IconWrapper>
);

export const EditIcon = () => (
    <IconWrapper className="h-5 w-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
    </IconWrapper>
);

export const DeleteIcon = () => (
    <IconWrapper className="h-5 w-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </IconWrapper>
);

export const CheckIcon = () => (
    <IconWrapper className="h-5 w-5 text-white" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </IconWrapper>
);
