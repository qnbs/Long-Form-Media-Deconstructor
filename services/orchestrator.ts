
import { TranscriptionAgent, SynthesizerAgent, FactCheckAgent, DeeperAnalysisAgent, VisualAnalysisAgent, ArchiveAgent, WebContentAgent, YoutubeAgent, TedTalkAgent, ArchiveOrgAgent } from './agents';
import type { AnalysisResult, AnalysisMode, AudioAnalysisResult } from '../types';

type AnalysisPipelineResult = {
    type: 'publication' | 'narrative' | 'audio' | 'video' | 'archive' | 'image';
    data: AnalysisResult;
};

export async function runArchiveOrgAnalysis(
    url: string,
    updateProgress: (message: string) => void,
    analysisMode: AnalysisMode,
): Promise<AnalysisPipelineResult | { type: 'text_content', data: string }> {
    updateProgress(`Step 1/1: Analyzing Internet Archive page and fetching content...`);
    const result = await ArchiveOrgAgent.processUrl(url);

    if (result.type === 'text') {
        return { type: 'text_content', data: result.data };
    } 
    
    // It's audio/video with a transcript
    const initialAnalysis = result.data as Pick<AudioAnalysisResult, 'transcript' | 'thematicSegments' | 'sentimentAnalysis'>;
    const transcriptText = initialAnalysis.transcript!.map(t => `${t.speaker}: ${t.text}`).join('\n');
    let factChecks = [];

    const totalSteps = analysisMode === 'express' ? 2 : 4;
    updateProgress(`Step 1/${totalSteps}: Fetched transcript from Internet Archive.`);

    if (analysisMode === 'standard') {
        updateProgress(`Step 2/${totalSteps}: Extracting verifiable claims from transcript...`);
        const claims = await SynthesizerAgent.extractClaimsFromTranscript(transcriptText);

        if (claims.length > 0) {
            updateProgress(`Step 3/${totalSteps}: Fact-checking ${claims.length} claims...`);
            factChecks = await FactCheckAgent.verifyClaims(claims);
        } else {
             updateProgress(`Step 3/${totalSteps}: No verifiable claims found.`);
        }
    } else {
        updateProgress(`Step 2/${totalSteps}: Skipping fact-checking in Express mode.`);
    }
    
    updateProgress(`Step ${totalSteps}/${totalSteps}: Finalizing dashboard...`);

    return {
        type: 'audio',
        data: {
            type: 'audio',
            transcript: initialAnalysis.transcript!,
            thematicSegments: initialAnalysis.thematicSegments,
            sentimentAnalysis: initialAnalysis.sentimentAnalysis,
            factChecks: factChecks.length > 0 ? factChecks : undefined,
            archiveOrgUrl: url,
        }
    };
}


export async function runTedTalkAnalysis(
    url: string,
    updateProgress: (message: string) => void,
    analysisMode: AnalysisMode
): Promise<AnalysisPipelineResult> {
    const totalSteps = analysisMode === 'express' ? 2 : 4;

    updateProgress(`Step 1/${totalSteps}: Fetching and analyzing TED Talk transcript...`);
    const initialAnalysis = await TedTalkAgent.analyzeTedTalkUrl(url);

    if (!initialAnalysis.transcript || initialAnalysis.transcript.length === 0) {
        throw new Error("Could not retrieve a valid transcript for the TED Talk.");
    }

    const transcriptText = initialAnalysis.transcript.map(t => `${t.speaker}: ${t.text}`).join('\n');
    let factChecks = [];

    if (analysisMode === 'standard') {
        updateProgress(`Step 2/${totalSteps}: Extracting verifiable claims from transcript...`);
        const claims = await SynthesizerAgent.extractClaimsFromTranscript(transcriptText);

        if (claims.length > 0) {
            updateProgress(`Step 3/${totalSteps}: Fact-checking ${claims.length} claims with Google Search...`);
            factChecks = await FactCheckAgent.verifyClaims(claims);
        } else {
             updateProgress(`Step 3/${totalSteps}: No verifiable claims found to check.`);
        }
    } else {
        updateProgress(`Step 2/${totalSteps}: Skipping fact-checking in Express mode.`);
    }
    
    updateProgress(`Step ${totalSteps}/${totalSteps}: Finalizing dashboard...`);

    return {
        type: 'audio',
        data: {
            type: 'audio',
            transcript: initialAnalysis.transcript,
            thematicSegments: initialAnalysis.thematicSegments,
            sentimentAnalysis: initialAnalysis.sentimentAnalysis,
            factChecks: factChecks.length > 0 ? factChecks : undefined,
            tedTalkUrl: url,
        }
    };
}


export async function runYoutubeAnalysis(
    url: string,
    updateProgress: (message: string) => void,
    analysisMode: AnalysisMode
): Promise<AnalysisPipelineResult> {
    const totalSteps = analysisMode === 'express' ? 2 : 4;

    updateProgress(`Step 1/${totalSteps}: Fetching and analyzing YouTube transcript...`);
    const initialAnalysis = await YoutubeAgent.analyzeYouTubeUrl(url);

    if (!initialAnalysis.transcript || initialAnalysis.transcript.length === 0) {
        return {
            type: 'audio',
            data: {
                type: 'audio',
                transcript: [],
                youtubeUrl: url,
            }
        };
    }

    const transcriptText = initialAnalysis.transcript.map(t => `${t.speaker}: ${t.text}`).join('\n');
    let factChecks = [];

    if (analysisMode === 'standard') {
        updateProgress(`Step 2/${totalSteps}: Extracting verifiable claims from transcript...`);
        const claims = await SynthesizerAgent.extractClaimsFromTranscript(transcriptText);

        if (claims.length > 0) {
            updateProgress(`Step 3/${totalSteps}: Fact-checking ${claims.length} claims with Google Search...`);
            factChecks = await FactCheckAgent.verifyClaims(claims);
        } else {
             updateProgress(`Step 3/${totalSteps}: No verifiable claims found to check.`);
        }
    } else {
        updateProgress(`Step 2/${totalSteps}: Skipping fact-checking in Express mode.`);
    }
    
    updateProgress(`Step ${totalSteps}/${totalSteps}: Finalizing dashboard...`);

    return {
        type: 'audio',
        data: {
            type: 'audio',
            transcript: initialAnalysis.transcript,
            thematicSegments: initialAnalysis.thematicSegments,
            sentimentAnalysis: initialAnalysis.sentimentAnalysis,
            factChecks: factChecks.length > 0 ? factChecks : undefined,
            youtubeUrl: url,
        }
    };
}


export async function runUrlAnalysis(
    url: string,
    updateProgress: (message: string) => void
): Promise<string> {
    const textContent = await WebContentAgent.fetchAndExtractText(url, updateProgress);
    return textContent;
}

export async function runTextAnalysis(
    textContent: string,
    updateProgress: (message: string) => void,
    analysisMode: AnalysisMode,
    textType: 'publication' | 'narrative'
): Promise<AnalysisPipelineResult> {
    if (textType === 'publication') {
        updateProgress(`Synthesizing publication...`);
        const analysisResult = await SynthesizerAgent.analyzePublication(textContent, analysisMode);
        return {
            type: 'publication',
            data: analysisResult
        };
    } else { // narrative
        updateProgress(`Deconstructing narrative work...`);
        const analysisResult = await SynthesizerAgent.analyzeNarrative(textContent, analysisMode);
        return {
            type: 'narrative',
            data: analysisResult
        };
    }
}


export async function runAnalysisPipeline(
    file: File,
    updateProgress: (message: string) => void,
    analysisMode: AnalysisMode
): Promise<AnalysisPipelineResult> {

    if (file.type === 'text/plain') {
        throw new Error("Internal error: runAnalysisPipeline should not be called for text files. Use runTextAnalysis instead.");
    } else if (file.type.startsWith('audio/')) {
        const totalSteps = analysisMode === 'express' ? 3 : 4;

        updateProgress(`Step 1/${totalSteps}: Transcribing audio... (this may take a moment)`);
        const transcriptResult = await TranscriptionAgent.transcribeAudio(file);
        
        const transcriptText = transcriptResult.map(t => `${t.speaker}: ${t.text}`).join('\n');
        
        if (transcriptText.trim().length === 0) {
             return {
                type: 'audio',
                data: { type: 'audio', transcript: [] }
            };
        }

        updateProgress(`Step 2/${totalSteps}: Analyzing themes and sentiment...`);
        const deepAnalysis = await DeeperAnalysisAgent.analyzeTranscript(transcriptText);

        let factChecks = [];
        if (analysisMode === 'standard') {
            updateProgress(`Step 3/${totalSteps}: Extracting verifiable claims...`);
            const claims = await SynthesizerAgent.extractClaimsFromTranscript(transcriptText);
            
            if (claims.length > 0) {
                updateProgress(`Step 4/${totalSteps}: Fact-checking ${claims.length} claims with Google Search...`);
                factChecks = await FactCheckAgent.verifyClaims(claims);
            } else {
                 updateProgress(`Step 4/${totalSteps}: No verifiable claims found to check.`);
            }
        } else {
            updateProgress(`Step 3/${totalSteps}: Skipping fact-checking in Express mode.`);
        }


        return {
            type: 'audio',
            data: {
                type: 'audio',
                transcript: transcriptResult,
                thematicSegments: deepAnalysis.thematicSegments,
                sentimentAnalysis: deepAnalysis.sentimentAnalysis,
                factChecks: factChecks.length > 0 ? factChecks : undefined,
            }
        };

    } else if (file.type.startsWith('video/')) {
        updateProgress(`Analyzing video with VisualAnalysisAgent. This may take several minutes...`);
        const analysisResult = await VisualAnalysisAgent.analyzeVideo(file, analysisMode);
        return {
            type: 'video',
            data: analysisResult,
        };
    
    } else if (file.type.startsWith('image/')) {
        updateProgress(`Analyzing image with VisualAnalysisAgent...`);
        const analysisResult = await VisualAnalysisAgent.analyzeImage(file);
        return {
            type: 'image',
            data: analysisResult,
        };

    } else {
        // Fallback for other file types in single-file mode
        updateProgress(`Running archival analysis on single file "${file.name}"...`);
        const archiveResult = await ArchiveAgent.analyzeCollection([file], analysisMode);
        return {
            type: 'archive',
            data: archiveResult,
        };
    }
}

export async function runArchiveAnalysisPipeline(
    files: File[],
    updateProgress: (message: string) => void,
    analysisMode: AnalysisMode
): Promise<AnalysisPipelineResult> {
    if (files.length === 0) {
        throw new Error('No files provided for archival analysis.');
    }
    updateProgress(`Analyzing archive of ${files.length} files. This may take several minutes...`);
    const analysisResult = await ArchiveAgent.analyzeCollection(files, analysisMode);
    return {
        type: 'archive',
        data: analysisResult,
    };
}
