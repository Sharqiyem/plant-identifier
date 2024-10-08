/* eslint-disable react-hooks/exhaustive-deps */
import Colors from '@/constants/Colors';
import { availableLanguages } from '@/data/languages';
import { useLanguageStore } from '@/store/useLanguageStore';
import { Language } from '@/types';
import { useNavigation } from '@react-navigation/native';
import Checkbox from 'expo-checkbox';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function Settings() {
  const { selectedLanguages, addLanguage, removeLanguage, loadLanguages, saveLanguages } =
    useLanguageStore();
  const navigation = useNavigation();
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    if (!isInitialLoad && selectedLanguages.length > 0) {
      saveLanguages();
    }
  }, [selectedLanguages, isInitialLoad]);

  useEffect(() => {
    loadLanguages();
  }, []);

  useEffect(() => {
    if (!isInitialLoad) {
      const unsubscribe = navigation.addListener('beforeRemove', (e) => {
        if (selectedLanguages.length === 0) {
          e.preventDefault();
          Alert.alert(
            'No Language Selected',
            'Please select at least one language before leaving this screen.',
            [{ text: 'OK' }]
          );
        } else {
          saveLanguages();
        }
      });

      return unsubscribe;
    } else {
      setIsInitialLoad(false);
    }
  }, [navigation, selectedLanguages, isInitialLoad]);

  const toggleLanguage = (language: Language) => {
    if (selectedLanguages.some((lang) => lang.languageCode === language.languageCode)) {
      removeLanguage(language.languageCode);
    } else {
      addLanguage(language);
    }
  };

  return (
    <View className="flex-1 bg-background p-4">
      <Text
        accessibilityLabel="Select Languages"
        className="text-2xl font-bold mb-4 text-foreground"
      >
        Select Languages
      </Text>
      <ScrollView className="flex-1">
        {availableLanguages.map((language) => (
          <TouchableOpacity
            key={language.languageCode}
            onPress={() => toggleLanguage(language)}
            className="flex-row items-center p-4 mb-2 bg-card rounded-lg"
          >
            <Checkbox
              testID={`checkbox-${language.languageCode}`}
              accessibilityLabel={language.languageName}
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
    </View>
  );
}
