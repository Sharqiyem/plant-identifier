import { ViewProps } from 'react-native';

export interface Language {
  languageCode: string;
  languageName: string;
}

export interface Plant {
  name: string;
  scientificName: string;
  family: string;
  description: string;
}

export interface PlantWithMeta extends Plant {
  timestamp: string;
  previewUri: string;
}

export interface ScanHistoryItem {
  [languageCode: string]: PlantWithMeta;
}

export interface BaseTestingComponentProps extends ViewProps {
  accessibilityLabel?: string;
}
