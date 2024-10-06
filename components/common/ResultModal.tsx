import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, SafeAreaView, Image } from 'react-native';
import { PlantWithMeta, Language } from '@/types';
import { PlantCard } from '@/components/common/PlantCard';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';

interface ResultModalProps {
  visible: boolean;
  onClose: () => void;
  plantInfo: { [key: string]: PlantWithMeta };
  languages: Language[];
}

export const ResultModal: React.FC<ResultModalProps> = ({
  visible,
  onClose,
  plantInfo,
  languages
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]?.languageCode || 'en');

  const languageCodes = Object.keys(plantInfo);
  const previewUri = plantInfo[languageCodes[0]]?.previewUri;

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <SafeAreaView className="flex-1 bg-black/70">
        <View className="flex-1 m-4 bg-card rounded-lg overflow-hidden">
          <View className="flex-row justify-between items-center p-4 border-b border-border">
            <Text className="text-2xl font-bold text-card-foreground">
              Plant Identification Results
            </Text>
            <TouchableOpacity
              testID="close-button"
              onPress={onClose}
              className="rounded-full p-2 bg-primary "
              accessibilityLabel="Close modal"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close" size={24} color={Colors.text} />
            </TouchableOpacity>
          </View>

          {previewUri && (
            <Image
              testID="plant-image"
              source={{ uri: previewUri }}
              className="w-full h-48 object-cover"
            />
          )}

          {plantInfo[selectedLanguage] && (
            <View className="px-4">
              <PlantCard testID="plant-card" plant={plantInfo[selectedLanguage]} />
            </View>
          )}

          <Text className="text-lg font-semibold text-primary mt-4 mb-2 px-4">All Languages</Text>

          <FlatList
            data={languageCodes}
            renderItem={({ item }) => (
              <View className="mb-6 px-4">
                <Text className="text-lg font-semibold text-accent mb-2">
                  {languages.find((lang) => lang.languageCode === item)?.languageName || item}
                </Text>
                <PlantCard testID="plant-card" plant={plantInfo[item]} />
              </View>
            )}
            keyExtractor={(item) => item}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
};
