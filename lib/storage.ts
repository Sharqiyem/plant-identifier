import AsyncStorage from '@react-native-async-storage/async-storage';
import { Plant, ScanHistory, ScanHistoryEntry, LanguageMap, Language } from '@/lib/types';

export const saveScanToHistory = async (plantData: { [languageCode: string]: Plant }, previewUri: string) => {
    try {
        // Read existing history
        const historyJson = await AsyncStorage.getItem('scanHistory');
        let history: ScanHistory = historyJson ? JSON.parse(historyJson) : { items: [] };

        // Ensure history.items is an array
        if (!Array.isArray(history.items)) {
            history.items = [];
        }

        // Create new history item
        const timestamp = new Date().toISOString();
        const newItem: ScanHistoryEntry = {
            plants: {},
            timestamp,
            previewUri
        };

        // Add plant data for each language
        for (const [languageCode, plant] of Object.entries(plantData)) {
            newItem.plants[languageCode] = { ...plant, timestamp, previewUri };
        }

        // Add new item to the beginning of the array
        history.items.unshift(newItem);

        // Save updated history
        await AsyncStorage.setItem('scanHistory', JSON.stringify(history));
        console.log('Scan history saved successfully');
    } catch (error) {
        console.error('Error saving scan to history:', error);
    }
};

export const loadSelectedLanguages = async (): Promise<Language[]> => {
    try {
        const savedLanguages = await AsyncStorage.getItem('selectedLanguages');
        if (savedLanguages) {
            return JSON.parse(savedLanguages);
        } else {
            // Default to English if no languages are saved
            const defaultLanguage: Language = { languageCode: 'en', languageName: 'English' };
            await AsyncStorage.setItem('selectedLanguages', JSON.stringify([defaultLanguage]));
            return [defaultLanguage];
        }
    } catch (error) {
        console.error('Error loading selected languages:', error);
        // Return default language in case of error
        return [{ languageCode: 'en', languageName: 'English' }];
    }
};

export const saveSelectedLanguages = async (languages: Language[]): Promise<void> => {
    try {
        await AsyncStorage.setItem('selectedLanguages', JSON.stringify(languages));
    } catch (error) {
        console.error('Error saving selected languages:', error);
    }
};