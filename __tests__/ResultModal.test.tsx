import { ResultModal } from '@/components/common/ResultModal'; // Adjust the import path as needed
import { PlantWithMeta } from '@/types';
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons'
}));

jest.mock('@/components/common/PlantCard', () => ({
  PlantCard: 'PlantCard'
}));

jest.mock('@/constants/Colors', () => ({
  text: '#000000'
}));

describe('ResultModal', () => {
  const mockOnClose = jest.fn();
  const mockPlantInfo: Record<string, PlantWithMeta> = {
    en: {
      name: 'English Plant',
      scientificName: 'Plantus Englishus',
      family: 'Plantaceae',
      description: 'This is an English plant.',
      previewUri: 'https://example.com/plant.jpg',
      timestamp: '2023-05-20T12:00:00Z'
    },
    es: {
      name: 'Planta Española',
      scientificName: 'Plantus Espanolus',
      family: 'Plantaceae',
      description: 'Esta es una planta española.',
      previewUri: 'https://example.com/plant.jpg',
      timestamp: '2023-05-20T12:00:00Z'
    }
  };
  const mockLanguages = [
    { languageCode: 'en', languageName: 'English' },
    { languageCode: 'es', languageName: 'Spanish' }
  ];

  const defaultProps = {
    visible: true,
    onClose: mockOnClose,
    plantInfo: mockPlantInfo,
    languages: mockLanguages
  };

  it('renders correctly', () => {
    const { getByText, getByTestId } = render(<ResultModal {...defaultProps} />);

    expect(getByText('Plant Identification Results')).toBeTruthy();
    expect(getByTestId('close-button')).toBeTruthy();
    expect(getByTestId('plant-image')).toBeTruthy();
    expect(getByText('All Languages')).toBeTruthy();
  });

  it('calls onClose when close button is pressed', () => {
    const { getByTestId } = render(<ResultModal {...defaultProps} />);

    fireEvent.press(getByTestId('close-button'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('renders PlantCard for each language', () => {
    const { getAllByTestId } = render(<ResultModal {...defaultProps} />);

    const plantCards = getAllByTestId('plant-card');
    expect(plantCards).toHaveLength(Object.keys(mockPlantInfo).length + 1);
  });

  it('displays correct language names', () => {
    const { getByText } = render(<ResultModal {...defaultProps} />);

    expect(getByText('English')).toBeTruthy();
    expect(getByText('Spanish')).toBeTruthy();
  });

  it('matches snapshot', () => {
    const tree = render(<ResultModal {...defaultProps} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
