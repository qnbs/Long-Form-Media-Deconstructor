import { Type } from "@google/genai";
import type { GenerateContentResponse, Part } from "@google/genai";
import { ai } from './geminiService';
import type { PublicationAnalysisResult, NarrativeAnalysisResult, TranscriptEntry, FactCheckResult, GroundingChunk, ThematicSegment, SentimentAnalysis, VideoNarrativeAnalysisResult, ArchiveAnalysisResult, AnalysisMode, ImageAnalysisResult, AudioAnalysisResult } from '../types';

// --- Utility Functions ---

function fileToGenerativePart(file: File): Promise<{mimeType: string, data: string}> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
        if (typeof reader.result !== 'string') {
            return reject('File could not be read as a data URL');
        }
        const base64String = reader.result.split(',')[1];
        resolve({
            mimeType: file.type || 'application/octet-stream', // Fallback MIME type
            data: base64String
        });
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

/**
 * Extracts a JSON object from a string, which may be wrapped in a markdown code block.
 * @param text The string to parse.
 * @returns The parsed JSON object.
 * @throws An error if JSON parsing fails.
 */
function extractJsonFromString(text: string): any {
    const match = text.match(/```json\s*([\s\S]*?)\s*```/);
    if (match && match[1]) {
        try {
            return JSON.parse(match[1]);
        } catch (e) {
            console.error("Failed to parse extracted JSON:", e);
            // Fallback to parsing the whole string if the block is malformed
        }
    }
    // Fallback for cases where the model doesn't use markdown
    try {
        return JSON.parse(text);
    } catch (e) {
        console.error("Failed to parse the entire string as JSON:", e);
        throw new Error("The AI returned a response that was not valid JSON.");
    }
}


// --- Agent Definitions ---

export const ArchiveOrgAgent = {
    async processUrl(url: string): Promise<{ type: 'text'; data: string } | { type: 'audio'; data: Omit<AudioAnalysisResult, 'type'> }> {
        const prompt = `You are an expert "Internet Archive Analyst" AI. Your task is to analyze the provided Internet Archive URL (archive.org/details/...) and extract its primary content.

        Instructions:
        1.  Use your search tool to analyze the content of the URL.
        2.  Determine the primary media type: is it 'text', 'audio', or 'video'?
        3.  **If the type is 'text'**: Find a link to the "Full Text" or plain text (.txt) version of the item. Fetch the content from that link and place it inside the 'textContent' field. The 'mediaType' should be 'text'.
        4.  **If the type is 'audio' or 'video'**: Search the page for a transcript. This is the most critical step. If a transcript is available on the page, perform a full analysis just like a YouTube video:
            a.  **Transcription and Diarization:** Capture the full transcript, identifying speakers and timestamps.
            b.  **Thematic Segmentation:** Break the content into topics with summaries and start times.
            c.  **Sentiment & Tone Analysis:** Analyze the overall sentiment and tone.
            The 'mediaType' should be 'audio' (treat video as audio for this purpose). The result should be structured like a typical audio analysis.
        5.  **If a transcript for an audio/video item CANNOT be found**: This is an important failure case. You MUST return a JSON object with mediaType 'unsupported' and an error message explaining that direct processing is not possible without a transcript and the user should download the file and upload it manually.

        IMPORTANT: Your output MUST be a single, valid JSON object wrapped in a markdown code block (\`\`\`json ... \`\`\`). The JSON object must have a "mediaType" key and a "content" key.
        
        Example for Text: \`\`\`json
{
  "mediaType": "text",
  "content": {
    "textContent": "The full text of the document goes here..."
  }
}
\`\`\`
        Example for Audio/Video with Transcript: \`\`\`json
{
  "mediaType": "audio",
  "content": {
    "transcript": [ { "speaker": "Speaker A", "timestamp": "00:00:10", "text": "..." } ],
    "thematicSegments": [ { "topic": "...", "summary": "...", "timestamp_start": "00:02:00" } ],
    "sentimentAnalysis": { "overallSentiment": "Neutral", "tone": "Informative", "summary": "..." }
  }
}
\`\`\`
        Example for Audio/Video WITHOUT Transcript: \`\`\`json
{
  "mediaType": "unsupported",
  "content": {
    "error": "A transcript could not be found for this audio/video item. Direct processing of media files from Internet Archive is not supported. Please download the file and upload it directly for analysis."
  }
}
\`\`\`
        URL to analyze: ${url}`;

        try {
            const response: GenerateContentResponse = await ai.models.generateContent({
                model: "gemini-2.5-flash", 
                contents: prompt,
                config: {
                    tools: [{ googleSearch: {} }],
                    temperature: 0.1,
                },
            });
            
            const parsedJson = extractJsonFromString(response.text.trim());

            if (parsedJson.mediaType === 'unsupported' && parsedJson.content?.error) {
                throw new Error(parsedJson.content.error);
            }

            if (parsedJson.mediaType === 'text' && parsedJson.content?.textContent) {
                return { type: 'text', data: parsedJson.content.textContent };
            }

            if (parsedJson.mediaType === 'audio' && parsedJson.content?.transcript) {
                return { type: 'audio', data: parsedJson.content };
            }

            throw new Error("The AI returned an unexpected or malformed response for the Internet Archive URL.");

        } catch (error) {
            console.error("ArchiveOrgAgent Error:", error);
            if (error instanceof Error) {
                throw error; // Re-throw specific errors from the agent or parsing
            }
            throw new Error("ArchiveOrgAgent failed to analyze the URL. The content might be inaccessible or in an unsupported format.");
        }
    }
};

export const TedTalkAgent = {
    async analyzeTedTalkUrl(url: string): Promise<Pick<AudioAnalysisResult, 'transcript' | 'thematicSegments' | 'sentimentAnalysis'>> {
        
        const jsonStructureExample = `{
            "transcript": [
                { "speaker": "Speaker", "timestamp": "00:00:12", "text": "..." }
            ],
            "thematicSegments": [
                { "topic": "...", "summary": "...", "timestamp_start": "00:02:30" }
            ],
            "sentimentAnalysis": {
                "overallSentiment": "Neutral", "tone": "Informative", "summary": "..."
            }
        }`;

        const prompt = `You are an expert "TED Talk Deconstructor" AI. Your task is to analyze the provided TED Talk URL.

        Instructions:
        1.  Use your search tool to find the full transcript of the talk at the given URL.
        2.  Analyze the entire transcript to perform the following three tasks:
            a.  **Transcription:** Convert all speech to text. TED Talks typically have only one speaker, label them as "Speaker". Assign a precise start timestamp (HH:MM:SS) for each line of dialogue.
            b.  **Thematic Segmentation:** Break the talk down into distinct topics. For each topic, provide a title, a summary, and its starting timestamp.
            c.  **Sentiment & Tone Analysis:** Determine the overall sentiment and prevailing tone of the entire talk and provide a brief summary explanation.
        
        IMPORTANT: Your output MUST be a single, valid JSON object wrapped in a markdown code block (\`\`\`json ... \`\`\`). Do not include any other text, greetings, or explanations before or after the JSON block.
        The JSON object must follow this structure: ${jsonStructureExample}

        If a transcript cannot be found for the given URL, you MUST return a JSON object with an "error" key, like this: \`\`\`json
{"error": "A transcript could not be found for the provided TED Talk URL."}
\`\`\`
        
        TED Talk URL: ${url}`;

        try {
            const response: GenerateContentResponse = await ai.models.generateContent({
                model: "gemini-2.5-flash", 
                contents: prompt,
                config: {
                    tools: [{ googleSearch: {} }],
                    temperature: 0.1,
                },
            });
            
            const parsedJson = extractJsonFromString(response.text.trim());

            if (parsedJson.error) {
                throw new Error(parsedJson.error);
            }
            
            if (!parsedJson.transcript || !Array.isArray(parsedJson.transcript)) {
                 throw new Error("The AI returned an invalid data structure for the transcript.");
            }
            
            const transcriptWithSpeaker = parsedJson.transcript.map((entry: any) => ({
                ...entry,
                speaker: entry.speaker || 'Speaker',
            }));

            return { ...parsedJson, transcript: transcriptWithSpeaker };

        } catch(error) {
            console.error("TedTalkAgent Error:", error);
            if (error instanceof Error && (error.message.includes("transcript could not be found") || error.message.includes("invalid data structure"))) {
                throw error; // Re-throw our specific, user-friendly errors
            }
            throw new Error("TedTalkAgent failed to analyze the talk. The AI could not process the request or find a valid transcript.");
        }
    }
};

export const YoutubeAgent = {
    async analyzeYouTubeUrl(url: string): Promise<Pick<AudioAnalysisResult, 'transcript' | 'thematicSegments' | 'sentimentAnalysis'>> {
        
        const jsonStructureExample = `{
            "transcript": [
                { "speaker": "Speaker A", "timestamp": "00:00:12", "text": "..." }
            ],
            "thematicSegments": [
                { "topic": "...", "summary": "...", "timestamp_start": "00:02:30" }
            ],
            "sentimentAnalysis": {
                "overallSentiment": "Neutral", "tone": "Informative", "summary": "..."
            }
        }`;

        const prompt = `You are an expert "YouTube Deconstructor" AI. Your task is to analyze the provided YouTube URL.

        Instructions:
        1.  Use your search tool to find the full transcript of the video at the given URL.
        2.  Analyze the entire transcript to perform the following three tasks:
            a.  **Transcription and Diarization:** Convert all speech to text, identify different speakers (label them generically like "Speaker A", "Speaker B"), and assign a precise start timestamp (HH:MM:SS) for each line of dialogue.
            b.  **Thematic Segmentation:** Break the conversation down into distinct topics. For each topic, provide a title, a summary, and its starting timestamp.
            c.  **Sentiment & Tone Analysis:** Determine the overall sentiment and prevailing tone of the entire conversation and provide a brief summary explanation.
        
        IMPORTANT: Your output MUST be a single, valid JSON object wrapped in a markdown code block (\`\`\`json ... \`\`\`). Do not include any other text, greetings, or explanations before or after the JSON block.
        The JSON object must follow this structure: ${jsonStructureExample}

        If a transcript cannot be found for the given URL, you MUST return a JSON object with an "error" key, like this: \`\`\`json
{"error": "A transcript could not be found for the provided YouTube URL."}
\`\`\`
        
        YouTube URL: ${url}`;

        try {
            const response: GenerateContentResponse = await ai.models.generateContent({
                model: "gemini-2.5-flash", 
                contents: prompt,
                config: {
                    tools: [{ googleSearch: {} }],
                    temperature: 0.1,
                },
            });
            
            const parsedJson = extractJsonFromString(response.text.trim());

            if (parsedJson.error) {
                throw new Error(parsedJson.error);
            }
            
            if (!parsedJson.transcript || !Array.isArray(parsedJson.transcript)) {
                 throw new Error("The AI returned an invalid data structure for the transcript.");
            }

            return parsedJson;
        } catch(error) {
            console.error("YoutubeAgent Error:", error);
            if (error instanceof Error && (error.message.includes("transcript could not be found") || error.message.includes("invalid data structure"))) {
                throw error; // Re-throw our specific, user-friendly errors
            }
            throw new Error("YoutubeAgent failed to analyze the video. The AI could not process the request or find a valid transcript.");
        }
    }
};

export const WebContentAgent = {
    async fetchAndExtractText(url: string, updateProgress: (msg: string) => void): Promise<string> {
        let html: string;
        try {
            updateProgress('Requesting URL content...');
            // NOTE: This client-side fetch is subject to CORS restrictions.
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
            }
            html = await response.text();
        } catch (error) {
            console.error('URL Fetch Error:', error);
             if (error instanceof TypeError) { // This often indicates a CORS issue
                throw new Error("Could not fetch the URL. This is likely due to CORS restrictions on the website. This feature works best with websites that have open access policies.");
            }
            throw new Error("Failed to fetch content from the provided URL due to a network error.");
        }

        updateProgress('Extracting main article from HTML...');
        const prompt = `You are an expert web content extractor. Analyze the following HTML content and extract only the main article text. Ignore all navigation bars, headers, footers, advertisements, sidebars, and other boilerplate content. Return only the clean, readable text of the article. If no main article is found, return an empty string.
        --- HTML CONTENT ---
        ${html}
        --- END HTML CONTENT ---`;

        try {
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
                config: { temperature: 0.0 }
            });
            return response.text.trim();
        } catch (error) {
            console.error("WebContentAgent extraction error:", error);
            throw new Error("Failed to extract article content from the webpage using AI.");
        }
    }
};

export const ArchiveAgent = {
    async analyzeCollection(files: File[], analysisMode: AnalysisMode = 'standard'): Promise<ArchiveAnalysisResult> {
        
        const archiveSchema = {
            type: Type.OBJECT, properties: {
                timeline: {
                    type: Type.ARRAY, description: "Chronological list of all dated events found across all documents.",
                    items: {
                        type: Type.OBJECT, properties: {
                            date: { type: Type.STRING, description: "The date of the event (e.g., YYYY-MM-DD, Month YYYY, YYYY)." },
                            event: { type: Type.STRING, description: "A short title for the event." },
                            description: { type: Type.STRING, description: "A brief description of the event." },
                            sourceDocument: { type: Type.STRING, description: "The filename where this event was found." }
                        }, required: ["date", "event", "description", "sourceDocument"]
                    }
                },
                entities: {
                    type: Type.ARRAY, description: "Key entities (people, organizations, locations) found, with disambiguation.",
                    items: {
                        type: Type.OBJECT, properties: {
                            name: { type: Type.STRING, description: "The canonical name of the entity." },
                            type: { type: Type.STRING, description: "The type of entity (e.g., Person, Organization, Location)." },
                            mentions: {
                                type: Type.ARRAY, items: {
                                    type: Type.OBJECT, properties: {
                                        document: { type: Type.STRING, description: "The filename of the mention." },
                                        context: { type: Type.STRING, description: "A text snippet showing the context of the mention." }
                                    }, required: ["document", "context"]
                                }
                            }
                        }, required: ["name", "type", "mentions"]
                    }
                },
                connections: {
                    type: Type.ARRAY, description: "Thematic connections and recurring motifs linking multiple documents.",
                    items: {
                        type: Type.OBJECT, properties: {
                            theme: { type: Type.STRING, description: "The title of the connecting theme." },
                            description: { type: Type.STRING, description: "An explanation of the thematic connection." },
                            connectingDocuments: {
                                type: Type.ARRAY, items: {
                                    type: Type.OBJECT, properties: {
                                        document: { type: Type.STRING, description: "The filename." },
                                        context: { type: Type.STRING, description: "A text snippet showing the connection in this document." }
                                    }, required: ["document", "context"]
                                }
                            }
                        }, required: ["theme", "description", "connectingDocuments"]
                    }
                }
            }, required: ["timeline", "entities", "connections"]
        };

        const analysisInstruction = analysisMode === 'express'
            ? `Your analysis should be high-level and concise. Identify a timeline of up to 10 major events, up to 5 key entities, and up to 3 major thematic connections.`
            : `Your analysis should be comprehensive and detailed. Extract all relevant information.`;

        const prompt = `You are an "Archive Investigator" AI. Your task is to analyze a heterogeneous collection of documents (which could include text, images, audio, video) and synthesize the information into a structured knowledge base.

        ${analysisInstruction}

        Perform the following three tasks across the ENTIRE collection:
        1.  **Timeline Creation:** Extract all dated events from all documents. Compile them into a single, chronological timeline. Include the source document for each event.
        2.  **Cross-Document Entity Recognition (NER):** Identify all significant entities (people, organizations, locations). Crucially, perform disambiguation: if "J. Smith" in one document and "John Smith" in another refer to the same person, consolidate them. For each entity, list all mentions with their source document and context.
        3.  **Thematic Clustering:** Identify recurring themes, topics, or motives that connect seemingly unrelated documents. For each theme, describe the connection and list the specific documents and context that support it.

        The files are provided sequentially. Your output MUST be a single JSON object that strictly adheres to the provided schema.`;

        const requestParts: Part[] = [{ text: prompt }];

        for (const file of files) {
            requestParts.push({ text: `\n\n--- START OF FILE: ${file.name} ---\n` });
            const { mimeType, data } = await fileToGenerativePart(file);
            requestParts.push({ inlineData: { mimeType, data } });
            requestParts.push({ text: `\n--- END OF FILE: ${file.name} ---\n` });
        }
        
        try {
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: { parts: requestParts },
                config: { responseMimeType: "application/json", responseSchema: archiveSchema, temperature: 0.2 },
            });
            const result = JSON.parse(response.text.trim()) as Omit<ArchiveAnalysisResult, 'type'>;
            return { ...result, type: 'archive' };
        } catch (error) {
            console.error("ArchiveAgent Error:", error);
            throw new Error("ArchiveAgent failed to analyze the collection. The context might be too large or contain unsupported data.");
        }
    }
};

export const TranscriptionAgent = {
    async transcribeAudio(audioFile: File): Promise<TranscriptEntry[]> {
        const audioPart = await fileToGenerativePart(audioFile);
        const prompt = `You are an AI assistant specialized in audio analysis. Transcribe the provided audio file and perform speaker diarization.

        Instructions:
        1.  **Transcribe:** Convert all spoken words to text.
        2.  **Identify Speakers:** Differentiate speakers and label them (e.g., "Speaker A", "Speaker B").
        3.  **Add Timestamps:** Provide a start timestamp for each speech segment in HH:MM:SS format.

        Your output MUST be a JSON object adhering to the provided schema. If no speech is detected, return an empty transcript array.`;

        const transcriptSchema = {
            type: Type.OBJECT, properties: {
                transcript: {
                    type: Type.ARRAY, description: "Full transcript with speaker labels and timestamps.",
                    items: {
                        type: Type.OBJECT, properties: {
                            speaker: { type: Type.STRING, description: "Identified speaker." },
                            timestamp: { type: Type.STRING, description: "Start time in HH:MM:SS." },
                            text: { type: Type.STRING, description: "Transcribed text." }
                        }, required: ["speaker", "timestamp", "text"]
                    }
                }
            }, required: ["transcript"]
        };

        try {
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: { parts: [{ text: prompt }, { inlineData: audioPart }] },
                config: { responseMimeType: "application/json", responseSchema: transcriptSchema },
            });
            const result = JSON.parse(response.text.trim()) as { transcript: TranscriptEntry[] };
            return result.transcript;
        } catch (error) {
            console.error("TranscriptionAgent Error:", error);
            throw new Error("TranscriptionAgent failed.");
        }
    }
};

export const VisualAnalysisAgent = {
    async analyzeVideo(videoFile: File, analysisMode: AnalysisMode = 'standard'): Promise<VideoNarrativeAnalysisResult> {
        const videoPart = await fileToGenerativePart(videoFile);
        const prompt = `You are a "Visual Analysis Agent" AI specialized in deconstructing narrative films and documentaries. Analyze the provided video by processing both its visual frames and audio track.

        Your task is to generate a comprehensive analysis covering three key areas:
        1.  **Plot Points:** Identify the major plot points and key events. For each, provide a precise timestamp, a short event title, a brief description, and a list of characters involved in the scene.
        2.  **Characters:** Identify the main characters and summarize their character arc or primary role throughout the narrative.
        3.  **Themes:** Identify the central themes and recurring motifs. For each theme, provide instances with timestamps and a description of how the theme is represented at that moment (visually or through dialogue).

        Your output MUST be a single JSON object that strictly adheres to the provided schema.`;

        const videoSchema = {
            type: Type.OBJECT,
            properties: {
                plot_points: {
                    type: Type.ARRAY,
                    description: "Key moments in the plot.",
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            timestamp: { type: Type.STRING, description: "Timestamp of the event in HH:MM:SS format." },
                            event: { type: Type.STRING, description: "A short title for the event." },
                            description: { type: Type.STRING, description: "A brief description of what happens." },
                            charactersInvolved: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of character names present or central to this event."}
                        },
                        required: ["timestamp", "event", "description", "charactersInvolved"]
                    }
                },
                characters: {
                    type: Type.ARRAY,
                    description: "Analysis of main characters.",
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING, description: "Name of the character." },
                            arc_summary: { type: Type.STRING, description: "A summary of the character's development or role." }
                        },
                        required: ["name", "arc_summary"]
                    }
                },
                themes: {
                    type: Type.ARRAY,
                    description: "Thematic analysis.",
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            theme: { type: Type.STRING, description: "The title of the theme." },
                            instances: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        timestamp: { type: Type.STRING, description: "Timestamp of the instance in HH:MM:SS format." },
                                        description: { type: Type.STRING, description: "How the theme is manifested in this scene." }
                                    },
                                    required: ["timestamp", "description"]
                                }
                            }
                        },
                        required: ["theme", "instances"]
                    }
                }
            },
            required: ["plot_points", "characters", "themes"]
        };

        try {
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash", 
                contents: { parts: [{ text: prompt }, { inlineData: videoPart }] },
                config: { 
                    responseMimeType: "application/json", 
                    responseSchema: videoSchema, 
                    temperature: 0.3,
                    ...(analysisMode === 'express' ? { maxOutputTokens: 2048, thinkingConfig: { thinkingBudget: 1024 } } : {})
                },
            });
            const result = JSON.parse(response.text.trim()) as Omit<VideoNarrativeAnalysisResult, 'type'>;
            return { ...result, type: 'video' };
        } catch (error) {
            console.error("VisualAnalysisAgent Error:", error);
            throw new Error("VisualAnalysisAgent failed to analyze the video. The file might be too large or in an unsupported format.");
        }
    },
    
    async analyzeImage(imageFile: File): Promise<ImageAnalysisResult> {
        const imagePart = await fileToGenerativePart(imageFile);
        const prompt = `You are a "Visual Analysis Agent" AI. Analyze the provided image.
        
        Your task is to generate a comprehensive analysis covering three key areas:
        1.  **Description:** Provide a detailed, rich description of the image, including mood, composition, and key elements.
        2.  **Identified Objects:** List the most prominent objects or entities visible in the image.
        3.  **Extracted Text:** If there is any text in the image (like signs, labels, or writing), extract it. If there is no text, this field can be omitted.
        
        Your output MUST be a single JSON object that strictly adheres to the provided schema.`;

        const imageSchema = {
            type: Type.OBJECT,
            properties: {
                description: {
                    type: Type.STRING,
                    description: "A detailed description of the entire image."
                },
                identifiedObjects: {
                    type: Type.ARRAY,
                    description: "A list of key objects identified in the image.",
                    items: { type: Type.STRING }
                },
                extractedText: {
                    type: Type.STRING,
                    description: "Any text extracted from the image via OCR."
                }
            },
            required: ["description", "identifiedObjects"]
        };
        
        try {
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: { parts: [{ text: prompt }, { inlineData: imagePart }] },
                config: { responseMimeType: "application/json", responseSchema: imageSchema, temperature: 0.3 },
            });
            const result = JSON.parse(response.text.trim()) as Omit<ImageAnalysisResult, 'type'>;
            return { ...result, type: 'image' };
        } catch (error) {
            console.error("VisualAnalysisAgent (Image) Error:", error);
            throw new Error("VisualAnalysisAgent failed to analyze the image.");
        }
    }
};

export const SynthesizerAgent = {
    async analyzePublication(textContent: string, analysisMode: AnalysisMode = 'standard'): Promise<PublicationAnalysisResult> {
        const publicationSchema = {
          type: Type.OBJECT, properties: {
            summary: {
              type: Type.OBJECT, properties: {
                thesis: { type: Type.STRING, description: "Concise summary of the paper's central thesis." },
                methodology: { type: Type.STRING, description: "Concise summary of the research methods." },
                results: { type: Type.STRING, description: "Concise summary of the key findings." },
              }, required: ["thesis", "methodology", "results"]
            },
            argumentMap: {
              type: Type.OBJECT, properties: {
                mainThesis: { type: Type.STRING, description: "The main thesis or core argument." },
                primaryArguments: {
                  type: Type.ARRAY, items: {
                    type: Type.OBJECT, properties: {
                      point: { type: Type.STRING, description: "The main point of the argument." },
                      supportingEvidence: { type: Type.ARRAY, items: { type: Type.STRING } },
                      counterArguments: { type: Type.ARRAY, items: { type: Type.STRING } }
                    }, required: ["point", "supportingEvidence"]
                  }
                }
              }, required: ["mainThesis", "primaryArguments"]
            },
            glossary: {
              type: Type.ARRAY, items: {
                type: Type.OBJECT, properties: {
                  term: { type: Type.STRING }, definition: { type: Type.STRING }
                }, required: ["term", "definition"]
              }
            }
          }, required: ["summary", "argumentMap", "glossary"]
        };
        const analysisInstruction = analysisMode === 'express'
            ? 'Your analysis should be brief and high-level. For the summary, provide a 1-2 sentence thesis. For the argument map, identify up to 3 primary arguments. For the glossary, define up to 5 key terms.'
            : 'Your analysis should be comprehensive and detailed.';

        const prompt = `You are a "Synthesizer Agent" AI specialized in deconstructing scientific publications. Analyze the provided text and transform it into a structured JSON object according to the schema. ${analysisInstruction}
        ---
        ${textContent}
        ---`;
        try {
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash", contents: prompt,
                config: { 
                    responseMimeType: "application/json", 
                    responseSchema: publicationSchema, 
                    temperature: 0.2,
                    ...(analysisMode === 'express' ? { maxOutputTokens: 2048, thinkingConfig: { thinkingBudget: 1024 } } : {})
                },
            });
            const result = JSON.parse(response.text.trim()) as Omit<PublicationAnalysisResult, 'type' | 'originalText'>;
            return { ...result, type: 'publication', originalText: textContent };
        } catch (error) {
            console.error("SynthesizerAgent (Publication) Error:", error);
            throw new Error("SynthesizerAgent failed to analyze the publication.");
        }
    },
    async analyzeNarrative(textContent: string, analysisMode: AnalysisMode = 'standard'): Promise<NarrativeAnalysisResult> {
        const narrativeSchema = {
            type: Type.OBJECT, properties: {
                plotSummary: { type: Type.STRING, description: "A concise summary of the main plot points." },
                characters: {
                    type: Type.ARRAY, description: "Profiles of the main characters.",
                    items: {
                        type: Type.OBJECT, properties: {
                            name: { type: Type.STRING },
                            description: { type: Type.STRING, description: "A brief analysis of the character's role and development." }
                        }, required: ["name", "description"]
                    }
                },
                themes: {
                    type: Type.ARRAY, description: "The central themes explored in the work.",
                    items: {
                        type: Type.OBJECT, properties: {
                            title: { type: Type.STRING, description: "The name of the theme." },
                            explanation: { type: Type.STRING, description: "How the theme is explored in the text." }
                        }, required: ["title", "explanation"]
                    }
                }
            }, required: ["plotSummary", "characters", "themes"]
        };
        
        const analysisInstruction = analysisMode === 'express'
            ? 'Your analysis should be brief and high-level. Provide a 3-4 sentence plot summary, identify up to 3 main characters, and describe up to 2 central themes.'
            : 'Your analysis should be comprehensive and detailed.';

        const prompt = `You are a "Synthesizer Agent" AI specialized in literary analysis. Analyze the provided narrative text (e.g., story, article, script) and transform it into a structured JSON object according to the schema. Identify the plot, main characters, and central themes. ${analysisInstruction}
        ---
        ${textContent}
        ---`;
        try {
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash", contents: prompt,
                config: { 
                    responseMimeType: "application/json", 
                    responseSchema: narrativeSchema, 
                    temperature: 0.5,
                    ...(analysisMode === 'express' ? { maxOutputTokens: 2048, thinkingConfig: { thinkingBudget: 1024 } } : {})
                },
            });
            const result = JSON.parse(response.text.trim()) as Omit<NarrativeAnalysisResult, 'type' | 'originalText'>;
            return { ...result, type: 'narrative', originalText: textContent };
        } catch (error) {
            console.error("SynthesizerAgent (Narrative) Error:", error);
            throw new Error("SynthesizerAgent failed to analyze the narrative work.");
        }
    },
    async extractClaimsFromTranscript(transcriptText: string): Promise<string[]> {
        const claimsSchema = {
            type: Type.OBJECT, properties: {
                claims: {
                    type: Type.ARRAY, description: "A list of specific, verifiable factual claims.",
                    items: { type: Type.STRING }
                }
            }, required: ["claims"]
        };
        const prompt = `You are a "Synthesizer Agent" AI. Read the following transcript and identify up to 5 of the most significant, specific, and factual claims that can be verified. A good claim is a statement of fact, not an opinion.
        Transcript:
        ---
        ${transcriptText}
        ---
        Your output MUST be a JSON object. If no verifiable claims are found, return an empty array.`;
        try {
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash", contents: prompt,
                config: { responseMimeType: "application/json", responseSchema: claimsSchema, temperature: 0.3 },
            });
            const result = JSON.parse(response.text.trim()) as { claims: string[] };
            return result.claims;
        } catch (error) {
            console.error("SynthesizerAgent (Claims) Error:", error);
            throw new Error("SynthesizerAgent failed to extract claims.");
        }
    }
};

export const DeeperAnalysisAgent = {
    async analyzeTranscript(transcriptText: string): Promise<{ thematicSegments: ThematicSegment[], sentimentAnalysis: SentimentAnalysis }> {
        const deepAnalysisSchema = {
            type: Type.OBJECT, properties: {
                thematicSegments: {
                    type: Type.ARRAY, description: "The transcript broken down by distinct topics.",
                    items: {
                        type: Type.OBJECT, properties: {
                            topic: { type: Type.STRING, description: "A short title for the topic." },
                            summary: { type: Type.STRING, description: "A concise summary of the discussion on this topic." },
                            timestamp_start: { type: Type.STRING, description: "The HH:MM:SS timestamp where this topic begins." }
                        }, required: ["topic", "summary", "timestamp_start"]
                    }
                },
                sentimentAnalysis: {
                    type: Type.OBJECT, properties: {
                        overallSentiment: { type: Type.STRING, description: "Overall sentiment (e.g., Positive, Negative, Neutral)." },
                        tone: { type: Type.STRING, description: "Prevailing tone (e.g., Professional, Casual, Tense)." },
                        summary: { type: Type.STRING, description: "A brief explanation of the sentiment and tone." }
                    }, required: ["overallSentiment", "tone", "summary"]
                }
            }, required: ["thematicSegments", "sentimentAnalysis"]
        };
        const prompt = `You are a "Deeper Analysis Agent" AI. Analyze the following transcript to identify its thematic structure and overall sentiment.
        1.  **Thematic Segmentation:** Break the conversation down into distinct topics. For each topic, provide a title, a summary, and the starting timestamp.
        2.  **Sentiment & Tone:** Determine the overall sentiment and prevailing tone of the conversation and provide a brief summary.
        Transcript:
        ---
        ${transcriptText}
        ---
        Your output must be a single JSON object adhering to the schema.`;
        try {
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash", contents: prompt,
                config: { responseMimeType: "application/json", responseSchema: deepAnalysisSchema, temperature: 0.3 },
            });
            return JSON.parse(response.text.trim());
        } catch (error) {
            console.error("DeeperAnalysisAgent Error:", error);
            throw new Error("DeeperAnalysisAgent failed to perform analysis.");
        }
    }
};


export const FactCheckAgent = {
    async verifyClaims(claims: string[]): Promise<FactCheckResult[]> {
        if (claims.length === 0) return [];

        const verificationPromises = claims.map(async (claim): Promise<FactCheckResult> => {
            const prompt = `You are a "FactCheck Agent" AI. Verify the following claim using Google Search. Provide a brief verification summary (e.g., "Confirmed," "Partially True," "False," "Unverifiable") and explain your reasoning.
            Claim: "${claim}"`;

            try {
                const response: GenerateContentResponse = await ai.models.generateContent({
                   model: "gemini-2.5-flash", contents: prompt,
                   config: { tools: [{googleSearch: {}}] },
                });

                const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[] || [];
                const verificationText = response.text;

                return {
                    claim: claim,
                    verification: verificationText,
                    sources: sources
                };
            } catch(error) {
                console.error(`FactCheckAgent Error verifying claim "${claim}":`, error);
                return {
                    claim: claim,
                    verification: "Failed to verify this claim due to an error.",
                    sources: []
                };
            }
        });
        
        return Promise.all(verificationPromises);
    }
};