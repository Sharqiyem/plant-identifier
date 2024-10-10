import { identifyPlant, parseGeminiResponse } from '@/lib/api';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Mock the @google/generative-ai module
jest.mock('@google/generative-ai');

// Mock the environment variable
jest.mock('@env', () => ({
  GOOGLE_GEMINI_API_KEY: 'mock-api-key'
}));

describe('API functions', () => {
  describe('identifyPlant', () => {
    it('should identify a plant successfully', async () => {
      // Mock the generateContent method
      const mockGenerateContent = jest.fn().mockResolvedValue({
        response: {
          text: () => JSON.stringify({
            en: {
              name: 'Rose',
              scientificName: 'Rosa',
              family: 'Rosaceae',
              description: 'A woody perennial flowering plant'
            }
          })
        }
      });

      // Mock the getGenerativeModel method
      (GoogleGenerativeAI.prototype.getGenerativeModel as jest.Mock).mockReturnValue({
        generateContent: mockGenerateContent
      });

      const base64Image = 'mock-base64-image';
      const languages = [{ languageCode: 'en', languageName: 'English' }];

      const result = await identifyPlant(base64Image, languages);

      expect(result).toEqual({
        en: {
          name: 'Rose',
          scientificName: 'Rosa',
          family: 'Rosaceae',
          description: 'A woody perennial flowering plant'
        }
      });

      expect(mockGenerateContent).toHaveBeenCalledWith([
        expect.stringContaining('Identify this plant'),
        { inlineData: { data: base64Image, mimeType: 'image/jpeg' } }
      ]);
    });

    it('should throw an error when API call fails', async () => {
      (GoogleGenerativeAI.prototype.getGenerativeModel as jest.Mock).mockReturnValue({
        generateContent: jest.fn().mockRejectedValue(new Error('API Error'))
      });

      const base64Image = 'mock-base64-image';
      const languages = [{ languageCode: 'en', languageName: 'English' }];

      await expect(identifyPlant(base64Image, languages)).rejects.toThrow('Failed to identify plant: API Error');
    });
  });

  describe('parseGeminiResponse', () => {
    it('should parse a valid response correctly', () => {
      const response = `
        {
          "en": {
            "name": "Sunflower",
            "scientificName": "Helianthus annuus",
            "family": "Asteraceae",
            "description": "A tall annual plant with large yellow flowers"
          }
        }
      `;
      const languages = [{ languageCode: 'en', languageName: 'English' }];

      const result = parseGeminiResponse(response, languages);

      expect(result).toEqual({
        en: {
          name: 'Sunflower',
          scientificName: 'Helianthus annuus',
          family: 'Asteraceae',
          description: 'A tall annual plant with large yellow flowers'
        }
      });
    });

    it('should throw an error for invalid JSON', () => {
      const response = 'Invalid JSON';
      const languages = [{ languageCode: 'en', languageName: 'English' }];

      expect(() => parseGeminiResponse(response, languages)).toThrow('Failed to parse plant identification results: Invalid JSON');
    });


    it('should throw an error for invalid plant information structure', () => {
      const response = `
              {
                "en": {
                  "name": "Sunflower",
                  "scientificName": "Helianthus annuus",
                  "family": "Asteraceae"
                }
              }
            `;
      const languages = [{ languageCode: 'en', languageName: 'English' }];

      expect(() => parseGeminiResponse(response, languages)).toThrow('Invalid plant information structure for language: en');
    });

    it('should throw an error for invalid plant information structure', () => {
      const response = `
              {
                "en": {
                  "name": "Sunflower",
                  "scientificName": "Helianthus annuus",
                  "family": "Asteraceae"
                }
              }
            `;
      const languages = [{ languageCode: 'en', languageName: 'English' }];

      expect(() => parseGeminiResponse(response, languages)).toThrow('Invalid plant information structure for language: en');
    });

    it('should throw an error for missing language data', () => {
      const response = `
              {
                "fr": {
                  "name": "Tournesol",
                  "scientificName": "Helianthus annuus",
                  "family": "Asteraceae",
                  "description": "Une grande plante annuelle avec de grandes fleurs jaunes"
                }
              }
            `;
      const languages = [{ languageCode: 'en', languageName: 'English' }];

      expect(() => parseGeminiResponse(response, languages)).toThrow('Missing plant information for language: en');
    });
  });

});