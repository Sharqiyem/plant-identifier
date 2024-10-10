import { BaseTestingComponentProps, Plant } from '@/types';
import React from 'react';
import { Platform, Text, View } from 'react-native';
import { twMerge } from 'tailwind-merge';

interface PlantCardProps extends BaseTestingComponentProps {
  plant: Plant;
  showTimestamp?: boolean;
  timestamp?: string;
}

export const PlantCard: React.FC<PlantCardProps> = ({
  plant,
  showTimestamp = false,
  timestamp,
  ...props
}) => {
  const { className } = props;
  const shadowStyle = Platform.select({
    ios: 'shadow-md shadow-black/50',
    android: 'elevation-md'
  });
  return (
    <View
      className={twMerge(
        `bg-card py-4 rounded-b-lg  mb-4 elevation-md px-2 ${shadowStyle} `,
        className
      )}
      {...props}
    >
      <Text testID="plant-name" className="text-card-foreground text-2xl font-bold mb-2">
        Name: {plant.name}
      </Text>
      <Text testID="plant-scientific-name" className="text-muted-foreground mb-1">
        Scientific Name: {plant.scientificName}
      </Text>
      <Text testID="plant-family" className="text-muted-foreground mb-1">
        Family: {plant.family}
      </Text>
      <Text testID="plant-description" className="text-foreground mb-2" numberOfLines={3}>
        {plant.description}
      </Text>
      {showTimestamp && timestamp && (
        <Text testID="plant-timestamp" className="text-muted-foreground text-sm">
          {new Date(timestamp).toLocaleString()}
        </Text>
      )}
    </View>
  );
};
