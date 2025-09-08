import { useContext } from 'react';
import { CommandPaletteContext } from '../contexts/CommandPaletteContext';

export const useCommandPalette = () => {
    const context = useContext(CommandPaletteContext);
    if (!context) {
        throw new Error('useCommandPalette must be used within a CommandPaletteProvider');
    }
    return context;
};
