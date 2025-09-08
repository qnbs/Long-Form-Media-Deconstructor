import type { Settings, AccentColor, ArchivedAnalysisItem } from '../types';
import { archiveService } from './archiveService';

const SETTINGS_KEY = 'deconstructor_settings';
const SESSION_KEY = 'deconstructor_session';
const VISITED_KEY = 'deconstructor_has_visited';
const ARCHIVE_KEY = 'deconstructor_archive';

const defaultSettings: Settings = {
    theme: 'dark',
    accentColor: 'sky',
    disableAnimations: false,
    highContrastMode: false,
    fontSize: 16, // Base font size in pixels
    defaultAnalysisType: 'single',
    defaultAnalysisMode: 'standard',
    chatShowSuggestions: true,
};

const accentColorMap: Record<AccentColor, { primary: string, secondary: string }> = {
    sky: { primary: '14 165 233', secondary: '79 70 229' }, // sky-500, indigo-600
    indigo: { primary: '99 102 241', secondary: '239 68 68' }, // indigo-400, red-500
    emerald: { primary: '16 185 129', secondary: '217 70 239' }, // emerald-500, fuchsia-500
    rose: { primary: '244 63 94', secondary: '20 184 166' }, // rose-500, teal-500
};

let currentSettings = { ...defaultSettings };

export const settingsService = {
    loadSettings(): Settings {
        try {
            const storedSettings = localStorage.getItem(SETTINGS_KEY);
            if (storedSettings) {
                const parsed = JSON.parse(storedSettings);
                currentSettings = { ...defaultSettings, ...parsed };
                return currentSettings;
            }
        } catch (error) {
            console.error('Failed to load settings, using defaults:', error);
        }
        currentSettings = { ...defaultSettings };
        return currentSettings;
    },

    saveSettings(settings: Settings): void {
        try {
            localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
            currentSettings = settings;
        } catch (error) {
            console.error('Failed to save settings:', error);
        }
    },

    applySettings(settings: Settings): void {
        const root = document.documentElement;

        // Apply theme (dark/light)
        root.classList.toggle('dark', settings.theme === 'dark');
        
        // Apply high contrast mode
        document.body.classList.toggle('high-contrast', settings.highContrastMode);
        
        // Apply accent color
        const colors = accentColorMap[settings.accentColor] || accentColorMap.sky;
        root.style.setProperty('--color-brand-primary', colors.primary);
        root.style.setProperty('--color-brand-secondary', colors.secondary);

        // Apply animation setting, respecting OS preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        document.body.classList.toggle('animations-disabled', settings.disableAnimations || prefersReducedMotion);
        
        // Apply font size
        root.style.setProperty('--base-font-size', `${settings.fontSize}px`);

        // Apply syntax highlighting theme
        let themeLink = document.getElementById('hljs-theme') as HTMLLinkElement | null;
        const themeUrl = settings.theme === 'dark'
            ? 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css'
            : 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-light.min.css';

        if (themeLink) {
            themeLink.href = themeUrl;
        } else {
            themeLink = document.createElement('link');
            themeLink.id = 'hljs-theme';
            themeLink.rel = 'stylesheet';
            themeLink.href = themeUrl;
            document.head.appendChild(themeLink);
        }
    },
    
    getSettings(): Settings {
        return currentSettings;
    },
    
    clearSession(): void {
        localStorage.removeItem(SESSION_KEY);
    },

    clearAllData(): void {
        try {
            // Get all keys before clearing
            const allKeys = Object.keys(localStorage);
            // Clear everything
            localStorage.clear();
            
            console.log('Cleared all application data.');

        } catch (error) {
            console.error('Failed to clear all user data:', error);
        }
    },

    exportAllData(): void {
        try {
            const settings = localStorage.getItem(SETTINGS_KEY);
            const archive = localStorage.getItem(ARCHIVE_KEY);
            
            const allData = {
                settings: settings ? JSON.parse(settings) : defaultSettings,
                archive: archive ? JSON.parse(archive) : [],
            };

            const jsonString = JSON.stringify(allData, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            const date = new Date().toISOString().slice(0, 10);
            a.download = `deconstructor_backup_${date}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

        } catch (error) {
            console.error('Failed to export data:', error);
            alert('An error occurred while exporting your data.');
        }
    },

    importAllData(jsonString: string): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                const data = JSON.parse(jsonString);

                if (!data || typeof data.settings !== 'object' || !Array.isArray(data.archive)) {
                    return reject(new Error("Invalid backup file format."));
                }
                
                // Clear existing data first
                this.clearAllData();

                // Import new data
                localStorage.setItem(SETTINGS_KEY, JSON.stringify(data.settings));
                localStorage.setItem(ARCHIVE_KEY, JSON.stringify(data.archive));
                
                resolve();

            } catch (error) {
                console.error('Failed to import data:', error);
                reject(new Error("Failed to parse the backup file. It may be corrupted."));
            }
        });
    }
};