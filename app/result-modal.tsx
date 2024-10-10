import ResultBottomSheet, { ResultBottomSheetRef } from '@/components/common/ResultBottomSheet';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { View } from 'react-native';

const ResultModal = () => {
  const params = useLocalSearchParams();
  const plantInfo = JSON.parse(params.plantInfo as string);
  const languages = JSON.parse(params.languages as string);

  const bottomSheetRef = useRef<ResultBottomSheetRef>(null);

  useEffect(() => {
    bottomSheetRef.current?.present();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <ResultBottomSheet ref={bottomSheetRef} plantInfo={plantInfo} languages={languages} />
    </View>
  );
};

export default ResultModal;
