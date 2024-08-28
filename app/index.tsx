import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Plant, ScanHistoryItem } from '@/lib/types';
import { identifyPlant } from '@/lib/api';
import { PlantCard } from '@/components/PlantCard';
import { useTheme } from '@react-navigation/native';
import { resizeImage } from '@/lib/helpers';

const Home = () => {
  const [image, setImage] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [plantInfo, setPlantInfo] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(false);
  const [resizedImageUri, setResizedImageUri] = useState('');

  const router = useRouter();
  const { colors } = useTheme();

  const retryHandler = () => {
    if (imageBase64) {
      setPlantInfo([]);
      identifyPlantFromImage(imageBase64, resizedImageUri);
    }
  };

  const pickImage = async (useCamera: boolean) => {
    let result;
    if (useCamera) {
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        base64: true
      });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        base64: true
      });
    }
    if (result.canceled) return;

    const res = result?.assets?.[0];
    if (!res) return;
    const { uri, base64 } = res;
    if (!uri || !base64) return;

    if (!result.canceled && uri) {
      setImage(result.assets[0].uri);
      setImageBase64(base64);
      const resizedImageUri = await resizeImage(uri);
      setResizedImageUri(resizedImageUri);
      identifyPlantFromImage(base64, resizedImageUri);
    }
  };

  const identifyPlantFromImage = async (base64: string, previewUri: string) => {
    setLoading(true);
    try {
      const plant = await identifyPlant(base64);
      setPlantInfo(plant);
      await saveScanToHistory(plant[0], previewUri);
      await saveScanToHistory(plant[1], previewUri);
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

  const saveScanToHistory = async (plantData: Plant, previewUri: string) => {
    try {
      const history = await AsyncStorage.getItem('scanHistory');
      const parsedHistory: ScanHistoryItem[] = history ? JSON.parse(history) : [];
      const updatedHistory = [
        { ...plantData, timestamp: new Date().toISOString(), previewUri },
        ...parsedHistory
      ];
      await AsyncStorage.setItem('scanHistory', JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Error saving scan to history:', error);
    }
  };

  return (
    <View className="flex-1 bg-white p-4">
      <View className="flex-row gap-1 mb-3">
        <TouchableOpacity
          onPress={() => pickImage(false)}
          className="bg-green-500 rounded-lg p-3 flex-1"
          disabled={loading}
        >
          <Text className="text-white text-center font-bold">
            {loading ? 'Identifying...' : 'Gallery'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => pickImage(true)}
          className="bg-green-500 rounded-lg p-3  flex-1"
          disabled={loading}
        >
          <Text className="text-white text-center font-bold">
            {loading ? 'Identifying...' : 'Camera'}
          </Text>
        </TouchableOpacity>
      </View>

      {image && <Image source={{ uri: image }} className="w-full h-64 rounded-lg mb-4" />}

      {image && !loading && (
        <TouchableOpacity onPress={retryHandler} className="bg-green-500 py-3 px-6 rounded-lg mb-4">
          <Text className="text-white text-center font-bold">Retry</Text>
        </TouchableOpacity>
      )}

      {loading && <ActivityIndicator size="large" color="#10B981" />}

      {plantInfo?.length > 0 &&
        !loading &&
        plantInfo?.map((item) => (
          <View className="mb-4" key={item.name}>
            <PlantCard plant={item} />
          </View>
        ))}
    </View>
  );
};

export default Home;
