import type { Chat, GenerateContentResponse } from "@google/genai";
import { ai } from './geminiService';

let chat: Chat | null = null;

export const chatService = {
  /**
   * Initializes a new chat session with context.
   * @param documentContext The full text of the document or a stringified JSON of the analysis.
   * @param contextType The type of context provided ('document' or 'analysis').
   */
  startChat: (documentContext: string, contextType: 'document' | 'analysis'): void => {
    let systemInstruction = '';
    if (contextType === 'document') {
        systemInstruction = `You are a helpful AI assistant. You are having a conversation with a user about a specific document they have provided. All of your answers should be based on the following document context. Do not use any outside knowledge unless explicitly asked to.

        --- DOCUMENT CONTEXT ---
        ${documentContext}
        --- END DOCUMENT CONTEXT ---`;
    } else { // contextType === 'analysis'
        systemInstruction = `You are a helpful AI assistant. You are having a conversation with a user about a set of AI-generated analysis results. All of your answers should be based on the following JSON data. Do not use any outside knowledge. When asked about the data, explain it in a clear, human-readable way.

        --- ANALYSIS JSON DATA ---
        ${documentContext}
        --- END ANALYSIS JSON DATA ---`;
    }

    chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: systemInstruction,
      },
    });
  },

  /**
   * Sends a message to the initialized chat and gets a streaming response.
   * @param message The user's message.
   * @returns An async iterator that yields response chunks.
   */
  async *sendMessageStream(message: string): AsyncGenerator<string, void, unknown> {
    if (!chat) {
      throw new Error("Chat not initialized. Call startChat() first.");
    }

    try {
      const result = await chat.sendMessageStream({ message });
      for await (const chunk of result) {
        yield chunk.text;
      }
    } catch (error) {
      console.error("Chat API error:", error);
      throw new Error("Failed to get response from the chat service.");
    }
  },

  /**
   * Resets the chat session.
   */
  endChat: (): void => {
    chat = null;
  }
};