import Colors from '@/constants/Colors';
import { Language } from '@/types';
import {
  BottomSheetFlatList,
  BottomSheetModal,
  BottomSheetModalProvider
} from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';
import React, { forwardRef, useCallback, useImperativeHandle, useMemo, useState } from 'react';
import { Image, Text, View } from 'react-native';
import { PlantCard } from './PlantCard';

type ResultBottomSheetProps = {
  plantInfo: any;
  languages: any;
};

export type ResultBottomSheetRef = {
  present: () => void;
};

const ResultBottomSheet = forwardRef<ResultBottomSheetRef, ResultBottomSheetProps>(
  ({ plantInfo, languages }, ref) => {
    const bottomSheetModalRef = React.useRef<BottomSheetModal>(null);
    const router = useRouter();

    const [selectedLanguage] = useState(languages[0]?.languageCode || 'en');

    const languageCodes = Object.keys(plantInfo);
    const previewUri = plantInfo[languageCodes[0]]?.previewUri;

    // variables
    const snapPoints = useMemo(() => ['95%'], []);

    // callbacks
    const handleSheetChanges = useCallback(
      (index: number) => {
        console.log('handleSheetChanges', index);
        if (index === -1) {
          // Sheet is closed
          router.back();
        }
      },
      [router]
    );

    useImperativeHandle(ref, () => ({
      present: () => {
        bottomSheetModalRef.current?.present();
      }
    }));

    // renders
    return (
      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={0}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
          enablePanDownToClose={true}
          handleStyle={{ backgroundColor: Colors.background }}
          handleComponent={() => (
            <View className="rounded-t-xl h-4  border-none justify-center items-center bg-background">
              <View className="w-14 h-[6px] rounded-full bg-primary" />
            </View>
          )}
        >
          <View className="flex-1 p-4 bg-background">
            <Text className="text-foreground text-2xl font-bold mb-4 ">
              Plant Identification Results
            </Text>
            {previewUri && (
              <Image
                testID="plant-image"
                source={{ uri: previewUri }}
                className="w-full h-48 object-cover"
              />
            )}

            {plantInfo[selectedLanguage] && (
              <View className="px-0 ">
                <PlantCard testID="plant-card" plant={plantInfo[selectedLanguage]} />
              </View>
            )}

            <Text className="text-lg font-semibold text-primary mt-4 mb-2">All Languages</Text>

            <BottomSheetFlatList
              showsVerticalScrollIndicator={false}
              data={languageCodes}
              renderItem={({ item }) => (
                <View className="mb-6  ">
                  <Text className="text-lg font-semibold text-accent mb-2">
                    {languages.find((lang: Language) => lang.languageCode === item)?.languageName ||
                      item}
                  </Text>
                  <PlantCard testID="plant-card" plant={plantInfo[item]} />
                </View>
              )}
              keyExtractor={(item) => item}
            />
          </View>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    );
  }
);

ResultBottomSheet.displayName = 'ResultBottomSheet';

export default ResultBottomSheet;
