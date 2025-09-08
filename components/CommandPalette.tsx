

import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { useCommandPalette } from '../hooks/useCommandPalette';
import { SearchIcon } from './IconComponents';

export const CommandPalette: React.FC = () => {
    const { isOpen, closePalette, commands } = useCommandPalette();
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLUListElement>(null);
    const paletteRef = useRef<HTMLDivElement>(null);

    const filteredCommands = commands.filter(cmd =>
        cmd.title.toLowerCase().includes(query.toLowerCase()) ||
        (cmd.description && cmd.description.toLowerCase().includes(query.toLowerCase()))
    );

    // Reset state when opening
    useEffect(() => {
        if (isOpen) {
            setQuery('');
            setSelectedIndex(0);
            setTimeout(() => inputRef.current?.focus(), 100); // Timeout to ensure focus works after render
        }
    }, [isOpen]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (!isOpen) return;

            if (event.key === 'Escape') {
                closePalette();
            } else if (event.key === 'ArrowDown') {
                event.preventDefault();
                setSelectedIndex(prev => (prev + 1) % (filteredCommands.length || 1));
            } else if (event.key === 'ArrowUp') {
                event.preventDefault();
                setSelectedIndex(prev => (prev - 1 + (filteredCommands.length || 1)) % (filteredCommands.length || 1));
            } else if (event.key === 'Enter') {
                event.preventDefault();
                if (filteredCommands[selectedIndex]) {
                    filteredCommands[selectedIndex].action();
                    closePalette();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, closePalette, filteredCommands, selectedIndex]);

    // Scroll selected item into view
    useEffect(() => {
        listRef.current?.children[selectedIndex]?.scrollIntoView({
            block: 'nearest',
        });
    }, [selectedIndex]);

    // Handle clicks outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (paletteRef.current && !paletteRef.current.contains(event.target as Node)) {
                closePalette();
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, closePalette]);


    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-start justify-center pt-24 animate-fade-in-fast"
            role="dialog"
            aria-modal="true"
            aria-labelledby="command-palette-label"
        >
            <div
                ref={paletteRef}
                className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-lg shadow-2xl w-full max-w-2xl mx-4 transform transition-all ring-1 ring-inset ring-white/10 dark:ring-slate-700/50"
                role="combobox"
                aria-expanded="true"
                aria-haspopup="listbox"
            >
                <h2 id="command-palette-label" className="sr-only">Command Palette</h2>
                <div className="relative">
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={e => {
                            setQuery(e.target.value);
                            setSelectedIndex(0);
                        }}
                        placeholder="Type a command or search..."
                        className="w-full bg-transparent border-b border-slate-300/50 dark:border-slate-700/50 pl-10 pr-4 py-4 focus:outline-none placeholder:text-slate-500 dark:placeholder:text-slate-400"
                        aria-autocomplete="list"
                        aria-controls="command-list"
                        aria-activedescendant={filteredCommands[selectedIndex]?.id}
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                        <SearchIcon />
                    </div>
                </div>
                <ul id="command-list" ref={listRef} className="max-h-96 overflow-y-auto p-2" role="listbox">
                    {filteredCommands.length > 0 ? (
                        filteredCommands.map((cmd, index) => (
                            <li
                                key={cmd.id}
                                id={cmd.id}
                                onMouseMove={() => setSelectedIndex(index)}
                                onClick={() => {
                                    cmd.action();
                                    closePalette();
                                }}
                                className={`flex items-center gap-4 p-3 rounded-md cursor-pointer ${
                                    selectedIndex === index ? 'bg-brand-primary text-white' : 'hover:bg-black/5 dark:hover:bg-white/10'
                                }`}
                                role="option"
                                aria-selected={selectedIndex === index}
                            >
                                <div className={selectedIndex === index ? 'text-white' : 'text-slate-500 dark:text-slate-400'}>
                                    {cmd.icon}
                                </div>
                                <div>
                                    <p className="font-semibold">{cmd.title}</p>
                                    <p className={`text-sm ${selectedIndex === index ? 'text-sky-200' : 'text-slate-500 dark:text-slate-400'}`}>
                                        {cmd.description}
                                    </p>
                                </div>
                            </li>
                        ))
                    ) : (
                        <li className="p-6 text-center text-slate-500">No commands found.</li>
                    )}
                </ul>
            </div>
        </div>,
        document.body
    );
};