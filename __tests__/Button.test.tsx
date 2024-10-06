import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '@/components/common/Button'; // Adjust the import path as needed

// Mock the Ionicons component
jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons'
}));

// Mock the Colors constant
jest.mock('@/constants/Colors', () => ({
  text: '#000000'
}));

describe('Button', () => {
  const mockOnPress = jest.fn();

  it('renders correctly with title and icon', () => {
    const { getByText, getByTestId } = render(
      <Button title="Test Button" iconName="add" onPress={mockOnPress} />
    );

    expect(getByText('Test Button')).toBeTruthy();
    expect(getByTestId('icon')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const { getByText } = render(
      <Button title="Test Button" iconName="add" onPress={mockOnPress} />
    );

    fireEvent.press(getByText('Test Button'));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('disables the button when disabled prop is true', () => {
    const { getByTestId } = render(
      <Button title="Test Button" iconName="add" onPress={mockOnPress} disabled />
    );

    const button = getByTestId('button');
    expect(button.props.accessibilityState.disabled).toBe(true);
  });

  it(`renders match with snapshot`, () => {
    const tree = render(
      <Button title="Test Button" iconName="add" onPress={mockOnPress} />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
