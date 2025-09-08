import { GoogleGenAI } from "@google/genai";

// This file centralizes the GoogleGenAI client initialization.
// All other services (agents, chat) should import the `ai` instance from here.

if (!process.env.API_KEY) {
    // This check is critical. If the API key is not set, the application
    // cannot function. Throwing an error here stops execution early and
    // makes the dependency clear.
    throw new Error("API_KEY environment variable not set. Please ensure it is configured.");
}

/**
 * A single, shared instance of the GoogleGenAI client.
 * This prevents creating multiple instances across the application, improving
 * efficiency and making configuration management simpler.
 */
export const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
