import React, { useEffect, useState } from 'react';
import { View, Text, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInUp, SlideInDown } from 'react-native-reanimated';
import { identifyPlant } from '@/lib/api';
import { pickImage } from '@/lib/image';
import { Language, Plant } from '@/lib/types';
import { Button } from '@/components/Button';
import { InfoSection } from '@/components/InfoSection';
import { ResultModal } from '@/components/ResultModal';
import { PlantCard } from '@/components/PlantCard';
import { loadSelectedLanguages, saveScanToHistory } from '@/lib/storage';
import { useLanguageStore } from '@/lib/store';

const Home: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [resizedImageUri, setResizedImageUri] = useState<string | null>(null);
  const [plantInfo, setPlantInfo] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const { selectedLanguages, loadLanguages } = useLanguageStore();

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
    try {
      const plantData = await identifyPlant(base64, selectedLanguages);

      setPlantInfo(Object.values(plantData)); // if you want to display all languages

      try {
        await saveScanToHistory(plantData, previewUri);
      } catch (saveError) {
        console.error('Error saving scan to history:', saveError);
        // Optionally, you can show a user-friendly message here
        // but continue with the flow as the plant was successfully identified
      }
    } catch (error) {
      console.error('Error identifying plant:', error);
      setPlantInfo([
        {
          name: 'Error',
          scientificName: '',
          family: '',
          description: 'Failed to identify plant. Please try again.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    if (imageBase64 && resizedImageUri) {
      setPlantInfo([]);
      identifyPlantFromImage(imageBase64, resizedImageUri);
    }
  };

  return (
    <View className="flex-1 bg-background p-4 py-8">
      {/* <Animated.View entering={FadeIn.delay(50).duration(200)} exiting={FadeOut} className="mb-6">
        <Text className="text-2xl font-bold text-center text-primary">Plant Identifier</Text>
      </Animated.View> */}

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
          <Button title="Retry" iconName="refresh" onPress={handleRetry} />
        </Animated.View>
      )}

      {loading && <ActivityIndicator size="large" color="#10B981" />}

      {plantInfo?.length > 0 && !loading && (
        <Animated.View entering={FadeIn.delay(300)} className="mt-4">
          <TouchableOpacity onPress={() => setModalVisible(true)} className="pb-8 ">
            <PlantCard plant={plantInfo[0]} />
            <Text className="text-center text-primary mt-2">View all results</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      <ResultModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        plantInfo={plantInfo}
      />
    </View>
  );
};

export default Home;
