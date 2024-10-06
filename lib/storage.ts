import AsyncStorage from '@react-native-async-storage/async-storage';
import { Language, Plant, ScanHistoryItem } from '@/lib/types';

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

export const saveScanToHistory = async (plantData: { [languageCode: string]: Plant }, previewUri: string) => {
    try {
        // Read existing history
        const historyJson = await AsyncStorage.getItem('scanHistory');
        let history: ScanHistoryItem[] = historyJson ? JSON.parse(historyJson) : [];

        // Create new history item
        const timestamp = new Date().toISOString();
        const newItem: { [languageCode: string]: Plant & { timestamp: string, previewUri: string } } = {};

        // Add plant data for each language
        for (const [languageCode, plant] of Object.entries(plantData)) {
            newItem[languageCode] = { ...plant, timestamp, previewUri };
        }

        // Add new item to the beginning of the array
        history.unshift(newItem);

        // Save updated history
        await AsyncStorage.setItem('scanHistory', JSON.stringify(history));
        console.log('Scan history saved successfully');
    } catch (error) {
        console.error('Error saving scan to history:', error);
    }
};

export const getScanHistory = async (): Promise<ScanHistoryItem[]> => {
    try {
        const historyJson = await AsyncStorage.getItem('scanHistory');
        return historyJson ? JSON.parse(historyJson) : [];
    } catch (error) {
        console.error('Error getting scan history:', error);
        return [];
    }
};

export const clearScanHistory = async (): Promise<void> => {
    try {
        await AsyncStorage.removeItem('scanHistory');
    } catch (error) {
        console.error('Error clearing scan history:', error);
    }
};

export const removeScanHistoryItem = async (index: number): Promise<void> => {
    try {
        const historyJson = await AsyncStorage.getItem('scanHistory');
        if (historyJson) {
            const history: ScanHistoryItem[] = JSON.parse(historyJson);
            history.splice(index, 1);
            await AsyncStorage.setItem('scanHistory', JSON.stringify(history));
        }
    } catch (error) {
        console.error('Error removing scan history item:', error);
    }
};