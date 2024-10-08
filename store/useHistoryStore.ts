import { create } from 'zustand';
import { ScanHistoryItem } from '@/types';
import {
  getScanHistory,
  clearScanHistory,
  removeScanHistoryItem,
  addScanHistoryItem
} from '@/lib/storage';

interface HistoryState {
  loading: boolean;
  history: ScanHistoryItem[];
  loadHistory: () => Promise<void>;
  clearHistory: () => Promise<void>;
  removeHistoryItem: (index: number) => Promise<void>;
  addHistoryItem: (item: ScanHistoryItem) => Promise<void>;
  setLoading: (loading: boolean) => void;
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  history: [],
  loading: true,
  loadHistory: async () => {
    set({ loading: true });
    const storedHistory = await getScanHistory();
    set({ history: storedHistory });
    set({ loading: false });
  },
  clearHistory: async () => {
    await clearScanHistory();
    set({ history: [] });
  },
  removeHistoryItem: async (index: number) => {
    await removeScanHistoryItem(index);
    set((state) => ({
      history: state.history.filter((_, i) => i !== index)
    }));
  },
  addHistoryItem: async (item: ScanHistoryItem) => {
    await addScanHistoryItem(item);
    set((state) => ({
      history: [item, ...state.history]
    }));
  },
  setLoading: (loading: boolean) => {
    set({ loading });
  }
}));
