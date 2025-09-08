import React, { useState, useEffect } from 'react';

interface LoaderProps {
    message: string;
}

const detailedMessages = [
    "Initializing agent swarm...",
    "Deconstructing content with Gemini...",
    "Analyzing multimodal inputs...",
    "This can take a few moments for large files...",
    "Extracting key entities and concepts...",
    "Building knowledge graph connections...",
    "The AI is thinking deeply...",
    "Synthesizing results into a dashboard...",
];

export const Loader: React.FC<LoaderProps> = ({ message }) => {
    const [detailedMessage, setDetailedMessage] = useState(detailedMessages[0]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setDetailedMessage(prev => {
                const currentIndex = detailedMessages.indexOf(prev);
                const nextIndex = (currentIndex + 1) % detailedMessages.length;
                return detailedMessages[nextIndex];
            });
        }, 3000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center text-center p-8 animate-fade-in" role="status" aria-live="polite">
            <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-brand-primary mb-6"></div>
            <p className="text-xl font-semibold text-slate-200">{message}</p>
            <p className="text-slate-400 mt-2 transition-opacity duration-500">{detailedMessage}</p>
        </div>
    );
};