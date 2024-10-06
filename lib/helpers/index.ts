import { Plant } from '@/lib/types';
import * as ImageManipulator from 'expo-image-manipulator';
import { availableLanguages } from '../data/availableLanguages';

function parseTextToPlant(text: string): Plant[] {
  const plants: Plant[] = [];
  const regex = /"(\w+)": {[^}]+}/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    const language = match[1];
    const plantData = match[0].replace(`"${language}": `, '').replace(/}/, '');
    const plant: Plant = {
      name: plantData.match(/"name": "([^"]+)"/)?.[1] || '',
      scientificName: plantData.match(/"scientific_name": "([^"]+)"/)?.[1] || '',
      family: plantData.match(/"family": "([^"]+)"/)?.[1] || '',
      description: plantData.match(/"description": "([^"]+)"/)?.[1] || ''
    };
    plants.push(plant);
  }

  return plants;
}

export const parseGeminiResponse = (response: string): Plant[] => {
  const data = parseTextToPlant(response);

  return data;
};

export const convertImageToBase64 = async (uri: string): Promise<string> => {
  const response = await fetch(uri);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export const resizeImage = async (uri: string): Promise<string> => {
  const manipulatedImage = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: 300 } }],
    { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
  );
  return manipulatedImage.uri;
};

export const getLanguageName = (code: string): string => {
  const language = availableLanguages.find((lang) => lang.languageCode === code);
  return language ? language.languageName : `Language ${code}`;
};

// Convert HSL to RGB
export const hslToRgb = (h: number, s: number, l: number): string => {
  h /= 360;
  s /= 100;
  l /= 100;
  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`;
};
export const hslStringToRgb = (hslString: string): string => {
  const match = hslString.match(/hsl\((\d+)\s+(\d+)%\s+(\d+)%\)/);
  if (!match) {
    throw new Error('Invalid HSL string format');
  }
  const [, h, s, l] = match.map(Number);
  return hslToRgb(h, s, l);
};
