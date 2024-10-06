import React from 'react';
import { render } from '@testing-library/react-native';
import { PlantCard } from '@/components/common/PlantCard';

describe('PlantCard', () => {
  const mockPlant = {
    name: 'Mock Plant',
    scientificName: 'Mockus plantus',
    family: 'Mockaceae',
    description: 'This is a mock plant for testing purposes.'
  };

  it('renders correctly with plant information', () => {
    const { getByTestId } = render(<PlantCard plant={mockPlant} />);

    expect(getByTestId('plant-name')).toHaveTextContent('Name: Mock Plant');
    expect(getByTestId('plant-scientific-name')).toHaveTextContent(
      'Scientific Name: Mockus plantus'
    );
    expect(getByTestId('plant-family')).toHaveTextContent('Family: Mockaceae');
    expect(getByTestId('plant-description')).toHaveTextContent(
      'This is a mock plant for testing purposes.'
    );
  });

  it('does not render timestamp by default', () => {
    const { queryByTestId } = render(<PlantCard plant={mockPlant} />);

    expect(queryByTestId('plant-timestamp')).toBeNull();
  });

  it('renders timestamp when showTimestamp is true and timestamp is provided', () => {
    const timestamp = '2023-05-20T12:00:00Z';
    const { getByTestId } = render(
      <PlantCard plant={mockPlant} showTimestamp timestamp={timestamp} />
    );

    expect(getByTestId('plant-timestamp')).toBeTruthy();
    expect(getByTestId('plant-timestamp')).toHaveTextContent(new Date(timestamp).toLocaleString());
  });

  it('applies correct props', () => {
    const { getByTestId } = render(<PlantCard plant={mockPlant} />);

    const descriptionElement = getByTestId('plant-description');

    expect(descriptionElement).toHaveProp('numberOfLines', 3);
  });

  it(`renders match with snapshot`, () => {
    const tree = render(<PlantCard plant={mockPlant} />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
