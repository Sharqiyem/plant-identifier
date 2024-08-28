import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GOOGLE_GEMINI_API_KEY } from '@env';
import { Plant } from '@/lib/types';
import { parseGeminiResponse, convertImageToBase64 } from '@/lib/helpers';

const genAI = new GoogleGenerativeAI(GOOGLE_GEMINI_API_KEY);
console.log('🚀 ~ GOOGLE_GEMINI_API_KEY:', GOOGLE_GEMINI_API_KEY);

export const identifyPlant = async (base64Image: string): Promise<Plant[]> => {
  try {
    // const base64Image = await convertImageToBase64(imageUri);

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent([
      'Identify this plant and provide its name, scientific name, family, and a brief description.  return the output as a json object in 2 languages english and arabic.',
      { inlineData: { data: base64Image, mimeType: 'image/jpeg' } }
    ]);

    const plantInfo = result.response.text();
    console.log('🚀 ~ identifyPlant ~ plantInfo:', plantInfo);

    return parseGeminiResponse(plantInfo);
  } catch (error) {
    console.error('Error identifying plant:');
    console.error('Error identifying plant:', error?.message);
    throw new Error('Failed to identify plant. Please try again.');
  }
};
