import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, SafeAreaView } from 'react-native';
import { Plant } from '@/lib/types';
import { PlantCard } from '@/components/PlantCard';

interface ResultModalProps {
  visible: boolean;
  onClose: () => void;
  plantInfo: { [key: string]: Plant };
}

export const ResultModal: React.FC<ResultModalProps> = ({ visible, onClose, plantInfo }) => (
  <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
    <SafeAreaView className="flex-1 bg-black/70">
      <View className="flex-1 m-4 bg-card rounded-lg overflow-hidden">
        <View className="flex-row justify-between items-center p-4 border-b border-border">
          <Text className="text-2xl font-bold text-card-foreground">All Results</Text>
          <TouchableOpacity onPress={onClose} className="bg-primary py-2 px-4 rounded-lg">
            <Text className="text-primary-foreground font-bold">Close</Text>
          </TouchableOpacity>
        </View>
        <ScrollView className="flex-1 p-4">
          {Object.entries(plantInfo).map(([langCode, plant]) => (
            <View key={langCode} className="mb-6">
              <Text className="text-lg font-semibold text-primary mb-2">
                {langCode.toUpperCase()}
              </Text>
              <PlantCard plant={plant} />
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  </Modal>
);
