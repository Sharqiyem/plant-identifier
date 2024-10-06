import React from 'react';
import { View, Text, Platform } from 'react-native';
import { Plant } from '@/types';

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

// import React from 'react';
// import { View, Text, Platform } from 'react-native';
// import { Plant } from '@/types';

// export const PlantCard = () => {
//   return (
//     <View className="p-4 bg-card rounded-lg shadow-md">
//       <View className="flex-row items-center justify-center mb-3">
//         {/* <Ionicons name="information-circle-outline" color={Colors.primary} size={24} /> */}
//         <Text className="ml-2 text-lg font-semibold text-primary">How to Use</Text>
//       </View>
//       <Text className="text-center text-base text-foreground leading-6">
//         To identify plants, select an image from your gallery or take a photo using the camera. Our
//         AI will analyze the image and provide detailed information about the plant.
//       </Text>
//     </View>
//   );
// };
