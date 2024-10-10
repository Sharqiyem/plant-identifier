import { Button } from '@/components/common/Button';
import { PlantCard } from '@/components/common/PlantCard';
import { ResultModal } from '@/components/common/ResultModal';
import { InfoSection } from '@/components/home/InfoSection';
import Colors from '@/constants/Colors';
import { identifyPlant } from '@/lib/api';
import { pickImage } from '@/lib/image';
import { useHistoryStore } from '@/store/useHistoryStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { PlantWithMeta } from '@/types';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Image, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, SlideInDown, SlideInUp } from 'react-native-reanimated';

const Home: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [resizedImageUri, setResizedImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { selectedLanguages, loadLanguages } = useLanguageStore();
  const [identifiedPlant, setIdentifiedPlant] = useState<{ [key: string]: PlantWithMeta } | null>(
    null
  );
  const { addHistoryItem } = useHistoryStore();
  const router = useRouter();

  console.log('🚀 ~ selectedLanguages:', selectedLanguages);

  useFocusEffect(
    useCallback(() => {
      loadLanguages();
    }, [loadLanguages])
  );

  const handleImagePick = async (useCamera: boolean) => {
    const result = await pickImage(useCamera);
    if (result) {
      setImage(result.uri);
      setImageBase64(result.base64);
      setResizedImageUri(result.resizedUri);
      identifyPlantFromImage(result.base64, result.resizedUri);
    }
  };

  const identifyPlantFromImage = async (base64: string, previewUri: string) => {
    setLoading(true);
    setError(null);
    try {
      console.log('🚀 ~ identifyPlantFromImage ~ selectedLanguages:', selectedLanguages);
      const plantData = await identifyPlant(
        base64,
        selectedLanguages ?? [{ languageCode: 'en', languageName: 'English' }]
      );
      const timestamp = new Date().toISOString();

      // Convert Plant to PlantWithMeta
      const plantDataWithMeta: { [key: string]: PlantWithMeta } = Object.fromEntries(
        Object.entries(plantData).map(([lang, plant]) => [
          lang,
          { ...plant, timestamp, previewUri }
        ])
      );

      setIdentifiedPlant(plantDataWithMeta);

      try {
        addHistoryItem(plantDataWithMeta);
      } catch (saveError) {
        console.error('Error saving scan to history:', saveError);
      }
    } catch (error) {
      console.error('Error identifying plant:', error);
      setError('Failed to identify plant. Please try again.');
      setIdentifiedPlant(null);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    if (imageBase64 && resizedImageUri) {
      setIdentifiedPlant(null);
      identifyPlantFromImage(imageBase64, resizedImageUri);
    }
  };

  const openResultModal = () => {
    router.push({
      pathname: '/result-modal',
      params: {
        plantInfo: JSON.stringify(identifiedPlant),
        languages: JSON.stringify(selectedLanguages)
      }
    });
  };

  return (
    <View className="flex-1 bg-background p-4 py-8">
      <Animated.View entering={SlideInUp.delay(100).duration(500)} className="flex-row gap-2 mb-4">
        <Button
          title="Gallery"
          iconName="images"
          onPress={() => handleImagePick(false)}
          disabled={loading}
          className="flex-1"
          accessibilityLabel="Gallery"
        />
        <Button
          title="Camera"
          iconName="camera"
          onPress={() => handleImagePick(true)}
          disabled={loading}
          className="flex-1"
          accessibilityLabel="Camera"
        />
      </Animated.View>

      {image ? (
        <Animated.View entering={FadeIn} className="w-full h-64 mb-4 overflow-hidden rounded-lg">
          <Image source={{ uri: image }} className="w-full h-full" resizeMode="cover" />
        </Animated.View>
      ) : (
        <Animated.View className="flex-1 mt-8" entering={SlideInDown.delay(200).duration(500)}>
          <InfoSection />
        </Animated.View>
      )}

      {image && !loading && (
        <Animated.View entering={FadeIn}>
          <Button
            title="Retry"
            iconName="refresh"
            onPress={handleRetry}
            className="bg-secondary text-secondary-foreground"
          />
        </Animated.View>
      )}

      {loading && (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      )}

      {error && (
        <Animated.View entering={FadeIn} className="mt-4">
          <Text accessibilityLabel="ErrorMessage" className="text-red-500 text-center">
            {error}
          </Text>
        </Animated.View>
      )}

      {identifiedPlant && !loading && (
        <Animated.View entering={FadeIn.delay(300)} className="mt-4">
          <TouchableOpacity onPress={openResultModal} className="pb-8">
            <PlantCard
              className="px-3"
              accessibilityLabel="PlantCard"
              plant={Object.values(identifiedPlant)[0]}
            />
            <Text
              accessibilityLabel="ViewAllResults"
              className="text-center text-primary mt-2 underline"
            >
              View all results
            </Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      <ResultModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        plantInfo={identifiedPlant || {}}
        languages={selectedLanguages}
        accessibilityLabel="ResultModal"
      />
    </View>
  );
};

export default Home;
