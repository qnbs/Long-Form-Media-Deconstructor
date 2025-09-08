

import type { ArchivedAnalysisItem, AnalysisResult, AnalysisType } from '../types';

const ARCHIVE_KEY = 'deconstructor_archive';

// --- Private Utility Functions ---

function getArchiveFromStorage(): ArchivedAnalysisItem[] {
    try {
        const storedArchive = localStorage.getItem(ARCHIVE_KEY);
        if (storedArchive) {
            // Sort by most recently updated
            return JSON.parse(storedArchive).sort((a: ArchivedAnalysisItem, b: ArchivedAnalysisItem) => 
                new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
            );
        }
    } catch (error) {
        console.error('Failed to load archive, returning empty.', error);
    }
    return [];
}

function saveArchiveToStorage(archive: ArchivedAnalysisItem[]): void {
    try {
        localStorage.setItem(ARCHIVE_KEY, JSON.stringify(archive));
    } catch (error) {
        console.error('Failed to save archive.', error);
    }
}

// --- Public Service Definition ---

export const archiveService = {
    /**
     * Retrieves all items from the analysis archive.
     * @returns An array of archived analysis items.
     */
    getArchive(): ArchivedAnalysisItem[] {
        return getArchiveFromStorage();
    },

    /**
     * Retrieves a single analysis item by its ID.
     * @param id The ID of the item to retrieve.
     * @returns The archived item, or null if not found.
     */
    getAnalysisById(id: string): ArchivedAnalysisItem | null {
        const archive = getArchiveFromStorage();
        return archive.find(item => item.id === id) || null;
    },

    /**
     * Adds a new analysis to the archive.
     * @param analysisData - The data for the new analysis.
     * @returns The newly created archived item.
     */
    addAnalysis(analysisData: {
        fileName: string;
        analysisType: AnalysisType;
        analysisResult: AnalysisResult;
        fileNames?: string[];
        mediaUrl?: string;
    }): ArchivedAnalysisItem {
        const archive = getArchiveFromStorage();
        const now = new Date().toISOString();

        const newItem: ArchivedAnalysisItem = {
            id: crypto.randomUUID(),
            title: analysisData.fileName, // Default title is the filename
            notes: '', // Starts with empty notes
            fileName: analysisData.fileName,
            analysisType: analysisData.analysisType,
            analysisResult: analysisData.analysisResult,
            createdAt: now,
            updatedAt: now,
            fileNames: analysisData.fileNames,
            mediaUrl: analysisData.mediaUrl,
        };
        
        // Add to the beginning of the array
        const updatedArchive = [newItem, ...archive];
        saveArchiveToStorage(updatedArchive);

        return newItem;
    },

    /**
     * Updates an existing analysis item in the archive.
     * @param id The ID of the item to update.
     * @param updates An object containing the fields to update (e.g., title, notes).
     * @returns The updated item, or null if not found.
     */
    updateAnalysis(id: string, updates: Partial<Pick<ArchivedAnalysisItem, 'title' | 'notes'>>): ArchivedAnalysisItem | null {
        let archive = getArchiveFromStorage();
        const itemIndex = archive.findIndex(item => item.id === id);

        if (itemIndex > -1) {
            const updatedItem = {
                ...archive[itemIndex],
                ...updates,
                updatedAt: new Date().toISOString(),
            };
            archive[itemIndex] = updatedItem;
            saveArchiveToStorage(archive);
            return updatedItem;
        }
        return null;
    },

    /**
     * Deletes an analysis item from the archive.
     * @param id The ID of the item to delete.
     * @returns True if deletion was successful, false otherwise.
     */
    deleteAnalysis(id: string): boolean {
        let archive = getArchiveFromStorage();
        const initialLength = archive.length;
        const updatedArchive = archive.filter(item => item.id !== id);

        if (updatedArchive.length < initialLength) {
            saveArchiveToStorage(updatedArchive);
            return true;
        }
        return false;
    },
};