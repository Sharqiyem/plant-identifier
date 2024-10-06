import { GoogleGenerativeAI } from '@google/generative-ai';
import { GOOGLE_GEMINI_API_KEY } from '@env';
import { Plant, Language } from '@/lib/types';

const genAI = new GoogleGenerativeAI(GOOGLE_GEMINI_API_KEY);

export const identifyPlant = async (
  base64Image: string,
  languages: Language[]
): Promise<{ [key: string]: Plant }> => {
  const selectedLanguages = languages.map((language) => language.languageName);
  const selectedLanguagesString = selectedLanguages.join(',');
  console.log('🚀 ~ identifyPlant ~ selectedLanguagesString:', selectedLanguagesString);

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
        "${languages[1].languageCode}": {
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
    // Remove Markdown code block syntax if present
    const cleanedResponse = response.replace(/```json\n?|\n?```/g, '').trim();

    // Try to parse the cleaned response as JSON
    const parsedResponse = JSON.parse(cleanedResponse);

    // Validate the structure of the parsed response
    const validatedResponse: { [key: string]: Plant } = {};

    languages.forEach((lang) => {
      if (parsedResponse[lang.languageCode]) {
        const plantInfo = parsedResponse[lang.languageCode];
        if (
          typeof plantInfo.name === 'string' &&
          typeof plantInfo.scientificName === 'string' &&
          typeof plantInfo.family === 'string' &&
          typeof plantInfo.description === 'string'
        ) {
          validatedResponse[lang.languageCode] = plantInfo as Plant;
        } else {
          throw new Error(`Invalid plant information structure for language: ${lang.languageCode}`);
        }
      } else {
        throw new Error(`Missing plant information for language: ${lang.languageCode}`);
      }
    });

    // console.log("🚀 ~ parseGeminiResponse ~ validatedResponse:", validatedResponse)
    return validatedResponse;
  } catch (error) {
    console.error('Error parsing Gemini response:', error);
    throw new Error('Failed to parse plant identification results.');
  }
};
