import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import Checkbox from 'expo-checkbox';
import { Language } from '@/lib/types';
import { loadSelectedLanguages, saveSelectedLanguages } from '@/lib/storage';
import { availableLanguages } from '@/lib/data/availableLanguages';
import { useLanguageStore } from '@/lib/store';
import Colors from '@/constants/Colors';

export default function Settings() {
  const { selectedLanguages, addLanguage, removeLanguage, loadLanguages, saveLanguages } =
    useLanguageStore();
  const router = useRouter();

  useEffect(() => {
    loadLanguages();
  }, []);

  const toggleLanguage = (language: Language) => {
    if (selectedLanguages.some((lang) => lang.languageCode === language.languageCode)) {
      removeLanguage(language.languageCode);
    } else {
      addLanguage(language);
    }
  };

  const handleSaveLanguages = async () => {
    if (selectedLanguages.length === 0) {
      alert('Please select at least one language.');
      return;
    }
    try {
      await saveLanguages();
      router.back();
    } catch (error) {
      console.error('Error saving selected languages:', error);
    }
  };

  return (
    <View className="flex-1 bg-background p-4">
      <Text className="text-2xl font-bold mb-4 text-foreground">Select Languages</Text>
      <ScrollView className="flex-1">
        {availableLanguages.map((language) => (
          <TouchableOpacity
            key={language.languageCode}
            onPress={() => toggleLanguage(language)}
            className="flex-row items-center p-4 mb-2 bg-card rounded-lg"
          >
            <Checkbox
              value={selectedLanguages.some((lang) => lang.languageCode === language.languageCode)}
              onValueChange={() => toggleLanguage(language)}
              color={
                selectedLanguages.some((lang) => lang.languageCode === language.languageCode)
                  ? Colors.primary
                  : undefined
              }
              className="mr-4"
            />
            <Text className="text-lg text-foreground">{language.languageName}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <TouchableOpacity
        onPress={handleSaveLanguages}
        className="bg-primary py-3 px-6 rounded-lg mt-4 flex-row items-center justify-center"
      >
        <Ionicons name="save-outline" size={24} color="white" style={{ marginRight: 8 }} />
        <Text className="text-primary-foreground text-center font-bold">Save</Text>
      </TouchableOpacity>
    </View>
  );
}
