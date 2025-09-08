
import React, { useState, useEffect, useRef } from 'react';
import { chatService } from '../services/chatService';
import { BrainCircuitIcon, CopyIcon, XIcon } from './IconComponents';
import { useAppContext } from './AppContext';

interface ChatInterfaceProps {
  documentContext: string;
  contextType: 'document' | 'analysis';
}

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

const suggestedPrompts = {
    document: [
        "Summarize this document in three sentences.",
        "What is the main argument or thesis?",
        "Identify the key people mentioned."
    ],
    analysis: [
        "Explain the main findings of this analysis.",
        "Are there any surprising connections?",
        "Provide a summary of the timeline."
    ]
};

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ documentContext, contextType }) => {
  const { settings } = useAppContext();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(settings.chatShowSuggestions);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isGenerationStopped = useRef(false);
  const [copyNotification, setCopyNotification] = useState('');

  useEffect(() => {
    chatService.startChat(documentContext, contextType);
    const initialMessage = contextType === 'document' 
        ? "Hello! Ask me any questions you have about this document."
        : "Hello! Ask me any questions you have about these analysis results.";
    setMessages([{ sender: 'ai', text: initialMessage }]);
    setShowSuggestions(settings.chatShowSuggestions);
    return () => {
      chatService.endChat();
    };
  }, [documentContext, contextType, settings.chatShowSuggestions]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    isGenerationStopped.current = false;
    const userMessage: Message = { sender: 'user', text: messageText };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setShowSuggestions(false);

    try {
        let aiResponseText = '';
        setMessages(prev => [...prev, { sender: 'ai', text: '' }]);
        
        for await (const chunk of chatService.sendMessageStream(messageText)) {
            if (isGenerationStopped.current) break;
            aiResponseText += chunk;
            setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = { sender: 'ai', text: aiResponseText };
                return newMessages;
            });
        }
    } catch (error) {
        console.error("Chat error:", error);
        setMessages(prev => {
            const newMessages = [...prev];
            const lastMessage = newMessages[newMessages.length - 1];
            // Only update if the last message is still the empty placeholder
            if (lastMessage.sender === 'ai' && lastMessage.text === '') {
                 newMessages[newMessages.length - 1] = { sender: 'ai', text: "Sorry, I encountered an error. Please try again." };
            } else { // Error happened after some text was received
                newMessages.push({ sender: 'ai', text: "Sorry, I encountered an error. Please try again." });
            }
            return newMessages;
        });
    } finally {
        setIsLoading(false);
        isGenerationStopped.current = false;
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(input);
  };
  
  const handleSuggestionClick = (prompt: string) => {
    setInput(prompt);
    handleSendMessage(prompt);
  };
  
  const handleStopGenerating = () => {
    isGenerationStopped.current = true;
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopyNotification('Copied!');
    setTimeout(() => setCopyNotification(''), 2000);
  };

  return (
    <div className="bg-slate-200/50 dark:bg-slate-800/50 rounded-lg shadow-inner w-full max-w-4xl mx-auto flex flex-col h-[60vh]">
        {copyNotification && <div className="absolute top-2 right-2 bg-emerald-500 text-white text-xs px-2 py-1 rounded shadow-lg animate-fade-in-fast z-20">{copyNotification}</div>}
      <div className="flex-grow p-4 space-y-4 overflow-y-auto" role="log" aria-live="polite">
        {messages.map((msg, index) => (
          <div key={index} className={`flex gap-3 items-end group ${msg.sender === 'user' ? 'justify-end' : ''}`}>
            {msg.sender === 'ai' && (
              <div className="w-8 h-8 rounded-full bg-sky-500 flex-shrink-0 flex items-center justify-center">
                <BrainCircuitIcon />
              </div>
            )}
            <div className={`relative max-w-xl p-3 rounded-xl whitespace-pre-wrap ${msg.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-slate-200'}`}>
              {msg.text || <span className="inline-block w-3 h-5 bg-slate-400 dark:bg-slate-500 animate-pulse rounded-sm" aria-label="AI is typing"></span>}
              {msg.sender === 'ai' && msg.text && (
                  <button onClick={() => handleCopy(msg.text)} className="absolute -top-2 -right-2 p-1 bg-slate-400 dark:bg-slate-600 rounded-full text-slate-700 dark:text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Copy AI response">
                      <CopyIcon />
                  </button>
              )}
            </div>
          </div>
        ))}
        {showSuggestions && messages.length < 2 && (
            <div className="pt-4 space-y-2 animate-fade-in">
                <p className="text-sm text-slate-500 dark:text-slate-400 text-center">Try asking one of these:</p>
                <div className="flex flex-wrap justify-center gap-2">
                    {suggestedPrompts[contextType].map(prompt => (
                         <button key={prompt} onClick={() => handleSuggestionClick(prompt)} className="px-3 py-1.5 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 text-sm rounded-full transition-colors">
                            "{prompt}"
                         </button>
                    ))}
                </div>
            </div>
        )}
         <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="p-4 border-t border-slate-300 dark:border-slate-700 flex items-center gap-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a follow-up question..."
          className="flex-grow bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-primary"
          disabled={isLoading}
          aria-label="Chat input"
        />
        {isLoading ? (
             <button
              type="button"
              onClick={handleStopGenerating}
              className="px-4 py-2 flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-lg shadow-md transition-colors duration-300"
              aria-label="Stop generating response"
            >
              <XIcon /> Stop
            </button>
        ) : (
             <button
              type="submit"
              disabled={!input.trim()}
              className="px-6 py-2 bg-brand-primary hover:bg-sky-600 text-white font-semibold rounded-lg shadow-md transition-colors duration-300 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed"
              aria-label="Send message"
            >
              Send
            </button>
        )}
      </form>
    </div>
  );
};