import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';

export const InfoSection: React.FC = () => (
  <View className="p-4 bg-card rounded-lg shadow-md">
    <View className="flex-row items-center justify-center mb-3">
      <Ionicons name="information-circle-outline" color={Colors.primary} size={24} />
      <Text className="ml-2 text-lg font-semibold text-primary">How to Use</Text>
    </View>
    <Text className="text-center text-base text-foreground leading-6">
      To identify plants, select an image from your gallery or take a photo using the camera. Our AI
      will analyze the image and provide detailed information about the plant.
    </Text>
  </View>
);
