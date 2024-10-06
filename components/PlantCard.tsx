import React from 'react';
import { View, Text, Platform } from 'react-native';
import { Plant } from '@/lib/types';

interface PlantCardProps {
  plant: Plant;
  showTimestamp?: boolean;
  timestamp?: string;
}

export const PlantCard: React.FC<PlantCardProps> = ({
  plant,
  showTimestamp = false,
  timestamp
}) => {
  const shadowStyle = Platform.select({
    ios: 'shadow-lg shadow-black/50',
    android: 'elevation-4'
  });

  return (
    <View className={`bg-card py-4 rounded-lg mb-4 ${shadowStyle}`}>
      <Text className="text-card-foreground text-2xl font-bold mb-2">Name: {plant.name}</Text>
      <Text className="text-muted-foreground mb-1">Scientific Name: {plant.scientificName}</Text>
      <Text className="text-muted-foreground mb-1">Family: {plant.family}</Text>
      <Text className="text-foreground mb-2">{plant.description}</Text>
      {showTimestamp && timestamp && (
        <Text className="text-muted-foreground text-sm">
          {new Date(timestamp).toLocaleString()}
        </Text>
      )}
    </View>
  );
};
