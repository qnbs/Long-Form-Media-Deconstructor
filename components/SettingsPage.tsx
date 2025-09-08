
import React, { useState, useEffect, useRef } from 'react';
import type { Settings, AccentColor } from '../types';
import { settingsService } from '../services/settingsService';
import { BackIcon, ChevronDownIcon, ContrastIcon, FontSizeIcon, KeyboardIcon, SyncIcon, ImportIcon, ThemeIcon, GaugeIcon, DownloadIcon, ErrorIcon, CheckIcon } from './IconComponents';
import { ConfirmationModal } from './ConfirmationModal';

interface SettingsPageProps {
    settings: Settings;
    onSave: (settings: Settings) => void;
    onBack: () => void;
}

const CollapsibleSection: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean }> = ({ title, icon, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <section className="bg-white/10 dark:bg-slate-900/20 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 shadow-lg rounded-xl ring-1 ring-inset ring-white/10 dark:ring-slate-700/50">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center p-4 text-left">
                <div className="flex items-center gap-3">
                    <div className="text-brand-primary">{icon}</div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{title}</h2>
                </div>
                <div className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}><ChevronDownIcon /></div>
            </button>
            {isOpen && (
                <div className="p-6 pt-2 animate-fade-in-fast">
                    {children}
                </div>
            )}
        </section>
    );
};

export const SettingsPage: React.FC<SettingsPageProps> = ({ settings, onSave, onBack }) => {
    const [localSettings, setLocalSettings] = useState<Settings>(settings);
    const [showClearModal, setShowClearModal] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);
    const [importData, setImportData] = useState<string | null>(null);
    const importFileRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        settingsService.applySettings(localSettings);
    }, [localSettings]);

    const handleSettingChange = <K extends keyof Settings>(key: K, value: Settings[K]) => {
        setLocalSettings(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = () => onSave(localSettings);

    const handleClearAllData = () => {
        settingsService.clearAllData();
        window.location.reload();
    };
    
    const handleImportClick = () => importFileRef.current?.click();

    const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target?.result as string;
                setImportData(text);
                setShowImportModal(true);
            };
            reader.readAsText(file);
        }
        // Reset file input value to allow re-uploading the same file
        event.target.value = '';
    };

    const confirmImport = () => {
        if (importData) {
            settingsService.importAllData(importData)
                .then(() => {
                    alert('Data imported successfully! The application will now reload.');
                    window.location.reload();
                })
                .catch(error => {
                    alert(`Import failed: ${error.message}`);
                    setShowImportModal(false);
                    setImportData(null);
                });
        }
    };

    return (
        <div className="w-full animate-fade-in max-w-4xl mx-auto">
            {showClearModal && (
                <ConfirmationModal onConfirm={handleClearAllData} onCancel={() => setShowClearModal(false)} title="Confirm Data Deletion">
                   <p>Are you sure? This will delete your entire archive, all saved notes, and settings. This cannot be undone.</p>
                </ConfirmationModal>
            )}
             {showImportModal && (
                <ConfirmationModal onConfirm={confirmImport} onCancel={() => setShowImportModal(false)} title="Confirm Data Import" confirmText="Import & Overwrite">
                   <p>Are you sure? Importing a backup file will <strong className="text-red-500">overwrite all existing data</strong>, including your archive and settings. This cannot be undone.</p>
                </ConfirmationModal>
            )}

            <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                 <div>
                    <button onClick={onBack} title="Return to the main application" className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-brand-primary mb-2">
                        <BackIcon /> Back to App
                    </button>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Settings</h1>
                </div>
                <button onClick={handleSave} title="Save settings and return" className="px-6 py-2 bg-brand-primary hover:bg-sky-600 text-white font-semibold rounded-lg shadow-md transition-colors">
                    Save & Close
                </button>
            </header>
            
            <div className="space-y-6">
                <CollapsibleSection title="Appearance" icon={<ThemeIcon />} defaultOpen>
                    <div className="space-y-6 text-slate-800 dark:text-slate-200">
                         <fieldset>
                            <legend className="block font-medium mb-2">Theme</legend>
                            <div className="flex gap-2 p-1 bg-slate-300/50 dark:bg-slate-800/50 rounded-lg">
                                <button onClick={() => handleSettingChange('theme', 'light')} title="Switch to Light theme" className={`w-1/2 p-2 rounded-md font-semibold transition-colors ${localSettings.theme === 'light' ? 'bg-white text-slate-800 shadow' : 'hover:bg-white/50'}`}>Light</button>
                                <button onClick={() => handleSettingChange('theme', 'dark')} title="Switch to Dark theme" className={`w-1/2 p-2 rounded-md font-semibold transition-colors ${localSettings.theme === 'dark' ? 'bg-slate-900 text-white shadow' : 'hover:bg-slate-900/50'}`}>Dark</button>
                            </div>
                        </fieldset>
                         <fieldset>
                            <legend className="block font-medium mb-2">Accent Color</legend>
                            <div className="flex gap-4">
                                {(['sky', 'indigo', 'emerald', 'rose'] as AccentColor[]).map(color => (
                                     <button
                                        key={color}
                                        onClick={() => handleSettingChange('accentColor', color)}
                                        aria-label={`Set accent color to ${color}`}
                                        title={`Set accent color to ${color}`}
                                        className={`relative w-10 h-10 rounded-full bg-${color}-500 transition-all duration-200 transform hover:scale-110 flex items-center justify-center ${
                                            localSettings.accentColor === color
                                            ? `ring-2 ring-offset-2 ring-offset-slate-200 dark:ring-offset-slate-900 ring-${color}-500`
                                            : 'ring-0'
                                        }`}
                                    >
                                        {localSettings.accentColor === color && <CheckIcon />}
                                    </button>
                                ))}
                            </div>
                        </fieldset>
                    </div>
                </CollapsibleSection>

                <CollapsibleSection title="Accessibility" icon={<ContrastIcon />}>
                    <div className="space-y-6 text-slate-800 dark:text-slate-200">
                        <div>
                            <label id="contrast-label" className="flex items-center justify-between cursor-pointer" title="Toggle High Contrast Mode for better visibility">
                                <span className="font-medium">High Contrast Mode</span>
                                <div className="relative">
                                    <input type="checkbox" role="switch" aria-checked={localSettings.highContrastMode} aria-labelledby="contrast-label" className="sr-only" checked={localSettings.highContrastMode} onChange={e => handleSettingChange('highContrastMode', e.target.checked)} />
                                    <div className={`block w-14 h-8 rounded-full transition-colors ${localSettings.highContrastMode ? 'bg-brand-primary' : 'bg-slate-300 dark:bg-slate-600'}`}></div>
                                    <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${localSettings.highContrastMode ? 'translate-x-6' : ''}`}></div>
                                </div>
                            </label>
                            <p className="text-sm text-slate-500 mt-1">Increases color contrast for better readability.</p>
                        </div>
                         <div>
                            <label htmlFor="font-size-slider" className="flex items-center justify-between">
                                <span className="font-medium flex items-center gap-2">
                                    <FontSizeIcon />
                                    Font Size
                                </span>
                                <span className="text-sm font-mono">{Math.round((localSettings.fontSize / 16) * 100)}%</span>
                            </label>
                            <input
                                id="font-size-slider" type="range" min="12" max="20" step="1"
                                value={localSettings.fontSize}
                                onChange={e => handleSettingChange('fontSize', parseInt(e.target.value, 10))}
                                className="w-full h-2 bg-slate-300 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer mt-2"
                                title="Adjust base font size"
                            />
                        </div>
                        <div>
                            <label id="animations-label" className="flex items-center justify-between cursor-pointer" title="Disable all UI animations for a simpler experience">
                                <span className="font-medium">Disable UI Animations</span>
                                <div className="relative">
                                    <input type="checkbox" role="switch" aria-checked={localSettings.disableAnimations} aria-labelledby="animations-label" className="sr-only" checked={localSettings.disableAnimations} onChange={e => handleSettingChange('disableAnimations', e.target.checked)} />
                                    <div className={`block w-14 h-8 rounded-full transition-colors ${localSettings.disableAnimations ? 'bg-brand-primary' : 'bg-slate-300 dark:bg-slate-600'}`}></div>
                                    <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${localSettings.disableAnimations ? 'translate-x-6' : ''}`}></div>
                                </div>
                            </label>
                            <p className="text-sm text-slate-500 mt-1">Also respects your operating system's 'Reduce Motion' setting.</p>
                        </div>
                    </div>
                </CollapsibleSection>
                
                <CollapsibleSection title="Productivity" icon={<GaugeIcon />}>
                    <div className="space-y-6 text-slate-800 dark:text-slate-200">
                        <fieldset>
                            <legend className="block font-medium mb-2">Default Analysis Type</legend>
                            <div className="flex gap-2 p-1 bg-slate-300/50 dark:bg-slate-800/50 rounded-lg">
                                <button onClick={() => handleSettingChange('defaultAnalysisType', 'single')} title="Set default to Single Source" className={`w-1/2 p-2 rounded-md font-semibold transition-colors ${localSettings.defaultAnalysisType === 'single' ? 'bg-white dark:bg-slate-900 text-slate-800 dark:text-white shadow' : 'hover:bg-white/50 dark:hover:bg-slate-900/50'}`}>Single Source</button>
                                <button onClick={() => handleSettingChange('defaultAnalysisType', 'archive')} title="Set default to Archival Collection" className={`w-1/2 p-2 rounded-md font-semibold transition-colors ${localSettings.defaultAnalysisType === 'archive' ? 'bg-white dark:bg-slate-900 text-slate-800 dark:text-white shadow' : 'hover:bg-white/50 dark:hover:bg-slate-900/50'}`}>Archival</button>
                            </div>
                        </fieldset>
                        <fieldset>
                            <legend className="block font-medium mb-2">Default Analysis Depth</legend>
                            <div className="flex gap-2 p-1 bg-slate-300/50 dark:bg-slate-800/50 rounded-lg">
                                <button onClick={() => handleSettingChange('defaultAnalysisMode', 'standard')} title="Set default to Standard for in-depth analysis" className={`w-1/2 p-2 rounded-md font-semibold transition-colors ${localSettings.defaultAnalysisMode === 'standard' ? 'bg-white dark:bg-slate-900 text-slate-800 dark:text-white shadow' : 'hover:bg-white/50 dark:hover:bg-slate-900/50'}`}>Standard</button>
                                <button onClick={() => handleSettingChange('defaultAnalysisMode', 'express')} title="Set default to Express for faster results" className={`w-1/2 p-2 rounded-md font-semibold transition-colors ${localSettings.defaultAnalysisMode === 'express' ? 'bg-white dark:bg-slate-900 text-slate-800 dark:text-white shadow' : 'hover:bg-white/50 dark:hover:bg-slate-900/50'}`}>Express</button>
                            </div>
                        </fieldset>
                         <div className="pt-2">
                             <h3 className="font-medium mb-2 flex items-center gap-2"><KeyboardIcon /> Keyboard Shortcuts</h3>
                             <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1 list-disc list-inside">
                                 <li><kbd className="font-sans border bg-slate-300 dark:bg-slate-700 border-slate-400 dark:border-slate-600 rounded px-1.5 py-0.5">⌘/Ctrl</kbd> + <kbd className="font-sans border bg-slate-300 dark:bg-slate-700 border-slate-400 dark:border-slate-600 rounded px-1.5 py-0.5">K</kbd> - Open Command Palette</li>
                                 <li><kbd className="font-sans border bg-slate-300 dark:bg-slate-700 border-slate-400 dark:border-slate-600 rounded px-1.5 py-0.5">⌘/Ctrl</kbd> + <kbd className="font-sans border bg-slate-300 dark:bg-slate-700 border-slate-400 dark:border-slate-600 rounded px-1.5 py-0.5">N</kbd> - Start New Analysis</li>
                                  <li><kbd className="font-sans border bg-slate-300 dark:bg-slate-700 border-slate-400 dark:border-slate-600 rounded px-1.5 py-0.5">⌘/Ctrl</kbd> + <kbd className="font-sans border bg-slate-300 dark:bg-slate-700 border-slate-400 dark:border-slate-600 rounded px-1.5 py-0.5">O</kbd> - Open Archive</li>
                                 <li><kbd className="font-sans border bg-slate-300 dark:bg-slate-700 border-slate-400 dark:border-slate-600 rounded px-1.5 py-0.5">⌘/Ctrl</kbd> + <kbd className="font-sans border bg-slate-300 dark:bg-slate-700 border-slate-400 dark:border-slate-600 rounded px-1.5 py-0.5">S</kbd> - Open Settings</li>
                                 <li><kbd className="font-sans border bg-slate-300 dark:bg-slate-700 border-slate-400 dark:border-slate-600 rounded px-1.5 py-0.5">⌘/Ctrl</kbd> + <kbd className="font-sans border bg-slate-300 dark:bg-slate-700 border-slate-400 dark:border-slate-600 rounded px-1.5 py-0.5">H</kbd> - Open Help Center</li>
                             </ul>
                        </div>
                    </div>
                </CollapsibleSection>
                
                <CollapsibleSection title="Sync & Backup" icon={<SyncIcon />}>
                    <div className="space-y-4 text-slate-800 dark:text-slate-200">
                        <p className="text-sm text-slate-500">Export all your data (settings, archive) into a single file to back it up or transfer to another browser.</p>
                        <div className="flex flex-col sm:flex-row gap-4">
                             <button onClick={settingsService.exportAllData} title="Export all data to a JSON file" className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-md transition-colors font-semibold">
                                <DownloadIcon /> Export All Data
                            </button>
                             <button onClick={handleImportClick} title="Import data from a backup file (will overwrite current data)" className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors font-semibold">
                                <ImportIcon /> Import from Backup
                            </button>
                            <input type="file" accept=".json" ref={importFileRef} onChange={handleFileImport} className="hidden" />
                        </div>
                    </div>
                </CollapsibleSection>

                 <CollapsibleSection title="Danger Zone" icon={<ErrorIcon />}>
                     <div className="space-y-4 p-4 border border-red-500/30 bg-red-500/10 rounded-lg">
                        <div>
                            <button onClick={() => setShowClearModal(true)} title="Permanently delete all data" className="w-full sm:w-auto px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors font-semibold">Clear All User Data</button>
                            <p className="text-sm text-red-400/80 mt-1">Permanently deletes all saved archives, notes, and settings from this browser.</p>
                        </div>
                    </div>
                 </CollapsibleSection>
            </div>
        </div>
    );
};
