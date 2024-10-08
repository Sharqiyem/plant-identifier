import HistoryItem from '@/components/history/HistoryItem'; // Adjust the import path as needed
import { PlantWithMeta } from '@/types';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';

// Mock the dependencies
jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));
jest.mock('react-native-gesture-handler', () => ({
  Gesture: {
    Pan: () => ({
      activeOffsetX: jest.fn().mockReturnThis(),
      onBegin: jest.fn().mockReturnThis(),
      onUpdate: jest.fn().mockReturnThis(),
      onEnd: jest.fn().mockReturnThis()
    }),
    Tap: () => ({
      onStart: jest.fn().mockReturnThis()
    }),
    Simultaneous: jest.fn()
  },
  GestureDetector: ({ children }: { children: React.ReactNode }) => children
}));

jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons'
}));

jest.mock('@/components/common/PlantCard', () => ({
  PlantCard: ({ plant }: { plant: PlantWithMeta }) => (
    <div data-testid="plant-card">{plant.name}</div>
  )
}));

describe('HistoryItem', () => {
  const mockItem = {
    en: {
      name: 'Test Plant',
      scientificName: 'Testus Plantus',
      family: 'Testaceae',
      description: 'This is a test plant.',
      previewUri: 'https://example.com/test-plant.jpg',
      timestamp: '2023-04-01T12:00:00Z'
    }
  };

  const mockOnDelete = jest.fn();

  const defaultProps = {
    item: mockItem,
    index: 0,
    onDelete: mockOnDelete,
    isLoading: false
  };

  it('renders correctly', async () => {
    const { getByTestId } = render(<HistoryItem {...defaultProps} />);

    await waitFor(() => {
      expect(getByTestId('plant-image')).toBeTruthy();
    });
  });

  //test calls handleDelete when delete button is pressed
  it('calls handleDelete when delete button is pressed', () => {
    const { getByTestId } = render(<HistoryItem {...defaultProps} />);

    fireEvent.press(getByTestId('corner-delete-button'));
    expect(mockOnDelete).toHaveBeenCalledWith(0);
  });
});
