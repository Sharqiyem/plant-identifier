import React, { useEffect, useState } from 'react';
import { View, Text, Image, Pressable, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import Animated, { SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { ScanHistoryItem, PlantWithMeta } from '@/lib/types';
import { PlantCard } from '@/components/PlantCard';
import { getScanHistory, clearScanHistory } from '@/lib/storage';
import { useLanguageStore } from '@/lib/store';
import { ResultModal } from '@/components/ResultModal';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const History = () => {
  const [history, setHistory] = useState<ScanHistoryItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<ScanHistoryItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { selectedLanguages } = useLanguageStore();

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const storedHistory = await getScanHistory();
      setHistory(storedHistory);
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

  const cleanHistory = async () => {
    try {
      await clearScanHistory();
      setHistory([]);
    } catch (error) {
      console.error('Error cleaning history:', error);
    }
  };

  const handleItemPress = (item: ScanHistoryItem) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const renderHistoryItem = ({ item, index }: { item: ScanHistoryItem; index: number }) => {
    const firstLanguage = Object.keys(item)[0];
    const plantInfo: PlantWithMeta = item[firstLanguage];

    return (
      <AnimatedTouchableOpacity
        entering={SlideInDown.delay(index * 100).duration(500)}
        exiting={SlideOutDown.duration(500).springify()}
        className="mb-4 bg-card rounded-lg overflow-hidden"
        onPress={() => handleItemPress(item)}
      >
        <Image source={{ uri: plantInfo.previewUri }} className="w-full h-40 object-cover" />
        <View className="p-4">
          <PlantCard plant={plantInfo} showTimestamp timestamp={plantInfo.timestamp} />
        </View>
      </AnimatedTouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-background">
      <Stack.Screen
        options={{
          headerRight: () => (
            <Pressable
              className="flex-row items-center bg-primary/10 p-2 px-3 rounded-full"
              onPress={cleanHistory}
            >
              <Ionicons
                name="trash-outline"
                size={24}
                color={Colors.text}
                style={{ marginRight: 4 }}
              />
              {/* <Text className="text-sm font-semibold text-foreground">Clean History</Text> */}
            </Pressable>
          )
        }}
      />
      <Animated.FlatList
        className="px-4 py-4"
        showsVerticalScrollIndicator={false}
        data={history}
        renderItem={renderHistoryItem}
        keyExtractor={(item, index) => index.toString()}
      />
      {selectedItem && (
        <ResultModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          plantInfo={selectedItem}
          languages={selectedLanguages}
        />
      )}
    </View>
  );
};

export default History;
