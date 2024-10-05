import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';

export const InfoSection: React.FC = () => (
  <View className="space-x-2 gap-4 bg-card items-center">
    <Ionicons name="information-circle-outline" color={Colors.primary} size={32} />

    <View className=" mb-2">
      <Text className="text-center text-lg text-foreground">
        To start identifying plants, select an image from your gallery or take a photo using the
        camera. Our AI will analyze the image and provide you with detailed information about the
        plant.
      </Text>
    </View>
  </View>
);
