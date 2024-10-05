import { create } from 'zustand';
import { Language } from '@/types';
import { loadSelectedLanguages, saveSelectedLanguages } from './storage';

interface LanguageState {
    selectedLanguages: Language[];
    setSelectedLanguages: (languages: Language[]) => void;
    addLanguage: (language: Language) => void;
    removeLanguage: (languageCode: string) => void;
    loadLanguages: () => Promise<void>;
    saveLanguages: () => Promise<void>;
}

export const useLanguageStore = create<LanguageState>((set, get) => ({
    selectedLanguages: [],
    setSelectedLanguages: (languages) => set({ selectedLanguages: languages }),
    addLanguage: (language) => set((state) => ({
        selectedLanguages: [...state.selectedLanguages, language]
    })),
    removeLanguage: (languageCode) => set((state) => ({
        selectedLanguages: state.selectedLanguages.filter(lang => lang.languageCode !== languageCode)
    })),
    loadLanguages: async () => {
        const languages = await loadSelectedLanguages();
        set({ selectedLanguages: languages });
    },
    saveLanguages: async () => {
        const { selectedLanguages } = get();
        await saveSelectedLanguages(selectedLanguages);
    }
}));