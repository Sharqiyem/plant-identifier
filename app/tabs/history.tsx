import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Image, Pressable, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { Stack } from 'expo-router';
import Animated, {
  SlideInDown,
  SlideOutDown,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS,
  interpolate,
  Extrapolate,
  useAnimatedGestureHandler,
  FadeIn
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { ScanHistoryItem, PlantWithMeta } from '@/types';
import { PlantCard } from '@/components/common/PlantCard';
import { getScanHistory, clearScanHistory, removeScanHistoryItem } from '@/lib/storage';
import { useLanguageStore } from '@/lib/store';
import { ResultModal } from '@/components/common/ResultModal';
import HistoryItem from '@/components/history/HistoryItem';
import Colors from '@/constants/Colors';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = -75;

const History = () => {
  const [history, setHistory] = useState<ScanHistoryItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<ScanHistoryItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { selectedLanguages } = useLanguageStore();

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const storedHistory = await getScanHistory();
    setHistory(storedHistory);
  };

  const cleanHistory = async () => {
    Alert.alert('Clean History', 'Are you sure you want to clear all history?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: async () => {
          await clearScanHistory();
          setHistory([]);
        }
      }
    ]);
  };

  const handleItemPress = useCallback((item: ScanHistoryItem) => {
    setSelectedItem(item);
    setModalVisible(true);
  }, []);

  const handleDeleteItem = useCallback(async (index: number) => {
    Alert.alert('Delete Item', 'Are you sure you want to delete this item?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await removeScanHistoryItem(index);
          loadHistory(); // Reload the history after deletion
        }
      }
    ]);
  }, []);

  const renderItem = useCallback(
    ({ item, index }: { item: ScanHistoryItem; index: number }) => (
      <HistoryItem
        item={item}
        index={index}
        onDelete={handleDeleteItem}
        onPress={handleItemPress}
      />
    ),
    [handleDeleteItem, handleItemPress]
  );

  return (
    <View className="flex-1 bg-background">
      <Stack.Screen
        options={{
          headerRight: () => (
            <Pressable className="  bg-primary/10  rounded-full" onPress={cleanHistory}>
              <Ionicons
                name="trash-outline"
                size={24}
                color={history.length === 0 ? Colors.muted : Colors.text}
                // style={{ marginRight: 4 }}
              />
              {/* <Text className="text-sm font-semibold text-primary">Clean History</Text> */}
            </Pressable>
          )
        }}
      />
      <Animated.View style={{ flex: 1 }}>
        <Animated.FlatList
          showsVerticalScrollIndicator={false}
          data={history}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ padding: 16 }}
          removeClippedSubviews={false}
          scrollEventThrottle={16}
        />
      </Animated.View>
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
