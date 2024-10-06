import React, { useEffect, useState } from 'react';
import { View, Image, ActivityIndicator, TouchableOpacity, Text } from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInUp, SlideInDown } from 'react-native-reanimated';
import { identifyPlant } from '@/lib/api';
import { pickImage } from '@/lib/image';
import { PlantWithMeta } from '@/types';
import { Button } from '@/components/common/Button';
import { InfoSection } from '@/components/home/InfoSection';
import { ResultModal } from '@/components/common/ResultModal';
import { PlantCard } from '@/components/common/PlantCard';
import { saveScanToHistory } from '@/lib/storage';
import { useLanguageStore } from '@/lib/store';
import Colors from '@/constants/Colors';

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

  useEffect(() => {
    loadLanguages();
  }, []);

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
      const plantData = await identifyPlant(base64, selectedLanguages);
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
        await saveScanToHistory(plantDataWithMeta, previewUri);
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

  return (
    <View className="flex-1 bg-background p-4 py-8">
      <Animated.View entering={SlideInUp.delay(100).duration(500)} className="flex-row gap-2 mb-4">
        <Button
          title="Gallery"
          iconName="images"
          onPress={() => handleImagePick(false)}
          disabled={loading}
          className="flex-1"
        />
        <Button
          title="Camera"
          iconName="camera"
          onPress={() => handleImagePick(true)}
          disabled={loading}
          className="flex-1"
        />
      </Animated.View>

      {image ? (
        <Animated.View entering={FadeIn}>
          <Image source={{ uri: image }} className="w-full h-64 rounded-lg mb-4" />
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
          <Text className="text-red-500 text-center">{error}</Text>
        </Animated.View>
      )}

      {identifiedPlant && !loading && (
        <Animated.View entering={FadeIn.delay(300)} className="mt-4">
          <TouchableOpacity onPress={() => setModalVisible(true)} className="pb-8">
            <PlantCard plant={Object.values(identifiedPlant)[0]} />
            <Text className="text-center text-primary mt-2 underline">View all results</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      <ResultModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        plantInfo={identifiedPlant || {}}
        languages={selectedLanguages}
      />
    </View>
  );
};

export default Home;
