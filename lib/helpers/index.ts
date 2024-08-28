import { Plant } from '../types';
import * as ImageManipulator from 'expo-image-manipulator';

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