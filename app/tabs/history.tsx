import HistoryItem from '@/components/history/HistoryItem';
import HistoryItemSkeleton from '@/components/history/HistoryItemSkeleton';
import Colors from '@/constants/Colors';
import { useHistoryStore } from '@/store/useHistoryStore';
import { ScanHistoryItem } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import React, { useCallback, useEffect } from 'react';
import { Alert, Pressable, View } from 'react-native';
import Animated, { FadeIn, Layout } from 'react-native-reanimated';

const History = () => {
  const { history, loadHistory, clearHistory, removeHistoryItem, loading } = useHistoryStore();

  useEffect(() => {
    loadHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCleanHistory = () => {
    Alert.alert('Clean History', 'Are you sure you want to clear all history?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: clearHistory
      }
    ]);
  };

  const handleDeleteItem = useCallback(
    (index: number) => {
      Alert.alert('Delete Item', 'Are you sure you want to delete this item?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => removeHistoryItem(index)
        }
      ]);
    },
    [removeHistoryItem]
  );

  const renderItem = useCallback(
    ({ item, index }: { item: ScanHistoryItem; index: number }) => (
      <Animated.View entering={FadeIn.delay(index * 50).duration(200)} layout={Layout.springify()}>
        {loading ? (
          <HistoryItemSkeleton />
        ) : (
          <HistoryItem item={item} index={index} onDelete={handleDeleteItem} isLoading={loading} />
        )}
      </Animated.View>
    ),
    [handleDeleteItem, loading]
  );

  return (
    <View className="flex-1 bg-background">
      <Stack.Screen
        options={{
          headerRight: () => (
            <Pressable className="bg-primary/10 rounded-full mx-4" onPress={handleCleanHistory}>
              <Ionicons
                name="trash-outline"
                size={24}
                color={history.length === 0 ? Colors.muted : Colors.text}
              />
            </Pressable>
          )
        }}
      />
      <View style={{ flex: 1 }}>
        <Animated.FlatList
          showsVerticalScrollIndicator={false}
          data={loading ? Array(5).fill({}) : history}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ padding: 16 }}
          removeClippedSubviews={false}
          scrollEventThrottle={16}
        />
      </View>
    </View>
  );
};

export default History;
