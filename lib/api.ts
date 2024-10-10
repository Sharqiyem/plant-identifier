import { Language, Plant } from '@/types';
import { GOOGLE_GEMINI_API_KEY } from '@env';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(GOOGLE_GEMINI_API_KEY);
console.log('🚀 ~ genAI:', genAI);

export const identifyPlant = async (
  base64Image: string,
  languages: Language[]
): Promise<{ [key: string]: Plant }> => {
  const selectedLanguages = languages.map((language) => language.languageName);
  const selectedLanguagesString = selectedLanguages.join(',');
  console.log('🚀 ~ identifyPlant ~ selectedLanguagesString:', languages);

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent([
      `Identify this plant and provide its name, scientific name, family, and a brief description. Return the output as a JSON object with the following structure:
      {
        "${languages[0].languageCode}": {
          "name": "",
          "scientificName": "",
          "family": "",
          "description": ""
        },
        "${languages[0].languageCode}": {
          "name": "",
          "scientificName": "",
          "family": "",
          "description": ""
        },
        ...
      }
      Provide this information in ${selectedLanguages.length} languages: ${selectedLanguagesString}. Do not include any additional text or formatting outside of the JSON structure.`,
      { inlineData: { data: base64Image, mimeType: 'image/jpeg' } }
    ]);

    const plantInfo = result.response.text();
    console.log('🚀 ~ identifyPlant ~ plantInfo:', plantInfo);

    return parseGeminiResponse(plantInfo, languages);
  } catch (error) {
    console.error('Error in identifyPlant:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to identify plant: ${error.message}`);
    } else {
      throw new Error('Failed to identify plant. Please try again.');
    }
  }
};

export const parseGeminiResponse = (
  response: string,
  languages: Language[]
): { [key: string]: Plant } => {
  try {
    const cleanedResponse = response.replace(/```json\n?|\n?```/g, '').trim();
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(cleanedResponse);
    } catch {
      throw new Error('Failed to parse plant identification results: Invalid JSON');
    }

    const validatedResponse: { [key: string]: Plant } = {};

    languages.forEach((lang) => {
      if (!parsedResponse[lang.languageCode]) {
        throw new Error(`Missing plant information for language: ${lang.languageCode}`);
      }

      const plantInfo = parsedResponse[lang.languageCode];
      if (
        typeof plantInfo.name !== 'string' ||
        typeof plantInfo.scientificName !== 'string' ||
        typeof plantInfo.family !== 'string' ||
        typeof plantInfo.description !== 'string'
      ) {
        throw new Error(`Invalid plant information structure for language: ${lang.languageCode}`);
      }

      validatedResponse[lang.languageCode] = plantInfo as Plant;
    });

    return validatedResponse;
  } catch (error) {
    if (error instanceof Error) {
      throw error; // Re-throw the specific error
    }
    throw new Error('Failed to parse plant identification results: Unknown error');
  }
};