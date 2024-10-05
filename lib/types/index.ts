export interface Plant {
  name: string;
  scientificName: string;
  family: string;
  description: string;
}

export interface ScanHistoryItem extends Plant {
  timestamp: string;
  previewUri: string;
}

export interface LanguageMap {
  [languageCode: string]: ScanHistoryItem;
}

export interface ScanHistoryEntry {
  plants: LanguageMap;
  timestamp: string;
  previewUri: string;
}

export interface ScanHistory {
  items: ScanHistoryEntry[];
}

export interface Language {
  languageCode: string;
  languageName: string;
}