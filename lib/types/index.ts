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
