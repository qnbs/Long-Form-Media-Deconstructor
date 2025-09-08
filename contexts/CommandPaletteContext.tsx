import React, { useState, useEffect, useCallback, createContext } from 'react';
import type { Command } from '../types';

interface CommandPaletteContextType {
  isOpen: boolean;
  openPalette: () => void;
  closePalette: () => void;
  registerCommands: (newCommands: Command[]) => void;
  unregisterCommands: (commandIds: string[]) => void;
  commands: Command[];
}

export const CommandPaletteContext = createContext<CommandPaletteContextType | undefined>(undefined);

export const CommandPaletteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [commands, setCommands] = useState<Command[]>([]);

    const openPalette = useCallback(() => setIsOpen(true), []);
    const closePalette = useCallback(() => setIsOpen(false), []);

    const registerCommands = useCallback((newCommands: Command[]) => {
        setCommands(prev => {
            const commandMap = new Map(prev.map(c => [c.id, c]));
            newCommands.forEach(c => commandMap.set(c.id, c));
            return Array.from(commandMap.values());
        });
    }, []);

    const unregisterCommands = useCallback((commandIds: string[]) => {
        setCommands(prev => prev.filter(c => !commandIds.includes(c.id)));
    }, []);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
                event.preventDefault();
                setIsOpen(prev => !prev);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const value = {
        isOpen,
        openPalette,
        closePalette,
        registerCommands,
        unregisterCommands,
        commands,
    };

    return (
        <CommandPaletteContext.Provider value={value}>
            {children}
        </CommandPaletteContext.Provider>
    );
};
