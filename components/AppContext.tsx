
import React, { createContext, useContext } from 'react';
import type { Settings } from '../types';

interface AppContextType {
    settings: Settings;
    resetAnalysis: () => void;
    isViewingArchivedItem: boolean;
    handleBackToArchive: () => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppContext.Provider');
    }
    return context;
};