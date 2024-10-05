import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScanHistoryItem } from '@/lib/types';
import { PlantCard } from '@/components/PlantCard';
import { Stack } from 'expo-router';

const History = () => {
  const [history, setHistory] = useState<ScanHistoryItem[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const cleanHistory = async () => {
    try {
      await AsyncStorage.removeItem('scanHistory');
      setHistory([]);
    } catch (error) {
      console.error('Error cleaning history:', error);
    }
  };

  const loadHistory = async () => {
    try {
      const storedHistory = await AsyncStorage.getItem('scanHistory');
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

  const renderHistoryItem = ({ item }: { item: ScanHistoryItem }) => (
    <View className={`flex-row mb-4 bg-card`}>
      <Image source={{ uri: item.previewUri }} className={`w-20 h-20 rounded-lg mr-4`} />
      <View className="flex-1">
        <PlantCard plant={item} showTimestamp timestamp={item.timestamp} />
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-background p-4">
      <Stack.Screen
        options={{
          headerRight: () => (
            <Pressable className="p-2 px-3 rounded-full flex flex-row gap-1" onPress={cleanHistory}>
              <Text className="text-sm text-foreground">Clean History</Text>
            </Pressable>
          )
        }}
      />
      <FlatList
        showsVerticalScrollIndicator={false}
        data={history}
        renderItem={renderHistoryItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

export default History;
