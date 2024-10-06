import { Plant } from '@/lib/types';

export const mockIdentifyPlant = async (base64Image: string): Promise<Plant[]> => {
  // Simulate some delay to mimic API call
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return [
    {
      name: 'Mock Plant',
      scientificName: 'Mockus plantus',
      family: 'Mockaceae',
      description: 'This is a mock plant description for testing purposes.'
    },
    {
      name: 'Another Mock Plant',
      scientificName: 'Fakeus vegetalis',
      family: 'Fakaceae',
      description: 'Another mock plant description for comprehensive testing.'
    }
  ];
};
