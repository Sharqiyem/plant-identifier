/* eslint-disable react/display-name */
import { PlantCard } from '@/components/common/PlantCard';
import Colors from '@/constants/Colors';
import { hslStringToRgb } from '@/lib/helpers';
import { useLanguageStore } from '@/store/useLanguageStore';
import { PlantWithMeta, ScanHistoryItem } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useRef } from 'react';
import { Dimensions, Image, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  clamp,
  FadeInRight,
  interpolate,
  interpolateColor,
  Layout,
  runOnJS,
  SlideInDown,
  SlideOutDown,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import HistoryItemSkeleton from './HistoryItemSkeleton';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(
  TouchableOpacity
) as React.ComponentClass<Animated.AnimateProps<TouchableOpacityProps>>;

const SWIPE_THRESHOLD = -75;
const { width: SCREEN_WIDTH } = Dimensions.get('window');

const dangerColor = hslStringToRgb(Colors.danger);
const cardColor = hslStringToRgb(Colors.card);

const HistoryItem = React.memo(
  ({
    item,
    index,
    onDelete,
    isLoading
  }: {
    item: ScanHistoryItem;
    index: number;
    onDelete: (index: number) => void;

    isLoading: boolean;
  }) => {
    const firstLanguage = Object.keys(item)[0];
    const plantInfo: PlantWithMeta = item[firstLanguage];
    const router = useRouter();
    const { selectedLanguages } = useLanguageStore();

    const translateX = useSharedValue(0);
    const isSwipeOpen = useSharedValue(false);
    const contextX = useSharedValue(0);

    const isCalledRef = useRef(false);

    const lastTapTime = useSharedValue(0);

    const itemPressHandler = useCallback(
      (item: ScanHistoryItem) => {
        if (isCalledRef.current) return;
        isCalledRef.current = true;

        console.log('itemPressHandler:', firstLanguage);

        router.push({
          pathname: '/result-modal',
          params: {
            plantInfo: JSON.stringify(item),
            languages: JSON.stringify(selectedLanguages)
          }
        });

        // Reset the flag after a short delay
        setTimeout(() => {
          isCalledRef.current = false;
        }, 1000); // Adjust this delay as needed
      },
      [firstLanguage, router, selectedLanguages]
    );

    const tapGesture = Gesture.Tap().onStart(() => {
      const now = Date.now();
      if (now - lastTapTime.value < 1000) {
        // If less than 1 second has passed since the last tap, ignore this tap
        return;
      }
      lastTapTime.value = now;

      if (isSwipeOpen.value) {
        translateX.value = withTiming(0);
        isSwipeOpen.value = false;
      } else {
        runOnJS(itemPressHandler)(item);
      }
    });

    const rStyle = useAnimatedStyle(() => {
      const scale = interpolate(translateX.value, [SWIPE_THRESHOLD, 0], [0.95, 1]);
      const backgroundColor = interpolateColor(
        translateX.value,
        [SWIPE_THRESHOLD, 0],
        [dangerColor, cardColor]
      );

      return {
        transform: [{ translateX: translateX.value }, { scale: clamp(scale, 0.95, 1) }],
        backgroundColor
      };
    });

    const rDeleteButtonStyle = useAnimatedStyle(() => {
      const opacity = interpolate(translateX.value, [SWIPE_THRESHOLD, 0], [1, 0]);

      return {
        opacity: clamp(opacity, 0, 1)
      };
    });

    const rCloseButtonStyle = useAnimatedStyle(() => {
      const opacity = interpolate(translateX.value, [SWIPE_THRESHOLD / 2, 0], [0, 1]);

      return {
        opacity: clamp(opacity, 0, 1)
      };
    });

    const animatedCloseButtonProps = useAnimatedProps(() => ({
      pointerEvents: translateX.value < SWIPE_THRESHOLD / 2 ? 'none' : 'auto'
    }));

    const animatedCardProps = useAnimatedProps(() => ({
      pointerEvents: translateX.value < SWIPE_THRESHOLD / 2 ? 'none' : 'auto'
    }));

    const panGesture = Gesture.Pan()
      .activeOffsetX([-10, 10])
      .onBegin(() => {
        contextX.value = translateX.value;
      })
      .onUpdate((event) => {
        const newTranslateX = contextX.value + event.translationX;
        translateX.value = clamp(newTranslateX, SWIPE_THRESHOLD, 0);
      })
      .onEnd(() => {
        const shouldBeDismissed = translateX.value < SWIPE_THRESHOLD / 2;
        if (shouldBeDismissed) {
          translateX.value = withTiming(SWIPE_THRESHOLD);
          isSwipeOpen.value = true;
        } else {
          translateX.value = withTiming(0);
          isSwipeOpen.value = false;
        }
      });

    const composedGestures = useMemo(
      () => Gesture.Simultaneous(panGesture, tapGesture),
      [panGesture, tapGesture]
    );

    const handleDelete = useCallback(() => {
      onDelete(index);
    }, [onDelete, index]);

    if (isLoading) {
      return <HistoryItemSkeleton />;
    }

    return (
      <Animated.View style={{ width: SCREEN_WIDTH }} layout={Layout.springify()}>
        <Animated.View
          entering={SlideInDown.delay(index * 50)
            .duration(100)
            .springify()}
          exiting={SlideOutDown.duration(500)}
          style={{ width: SCREEN_WIDTH, marginBottom: 16 }}
        >
          <View testID="history-item-gesture">
            <GestureDetector gesture={composedGestures}>
              <Animated.View
                className="bg-red-500"
                style={[
                  { flexDirection: 'row', width: SCREEN_WIDTH + Math.abs(SWIPE_THRESHOLD) },
                  rStyle
                ]}
              >
                <Animated.View
                  style={{ width: SCREEN_WIDTH - Math.abs(SWIPE_THRESHOLD / 2) }}
                  className="bg-card rounded-lg overflow-hidden"
                >
                  <AnimatedTouchableOpacity
                    testID="history-item-touchable"
                    animatedProps={animatedCardProps as any}
                    // className="bg-red-500 rounded-lg overflow-hidden"
                    // onPress={() => itemPressHandler(item)} // relay solely on the gesture
                    activeOpacity={0.9}
                  >
                    <Image
                      testID="plant-image"
                      source={{ uri: plantInfo.previewUri }}
                      className="w-full h-40 object-cover overflow-hidden rounded-t-lg"
                    />

                    <PlantCard
                      className="px-2"
                      testID="plant-card"
                      plant={plantInfo}
                      showTimestamp
                      timestamp={plantInfo.timestamp}
                    />
                  </AnimatedTouchableOpacity>
                </Animated.View>
                <Animated.View
                  style={[
                    rDeleteButtonStyle,
                    {
                      width: Math.abs(SWIPE_THRESHOLD),
                      justifyContent: 'center',
                      alignItems: 'center'
                    }
                  ]}
                >
                  <TouchableOpacity
                    testID="delete-button"
                    onPress={handleDelete}
                    className="p-4 rounded-lg"
                  >
                    <Ionicons name="trash-outline" size={24} color="white" />
                  </TouchableOpacity>
                </Animated.View>
              </Animated.View>
            </GestureDetector>
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeInRight.delay(index * 1000).duration(500)}
          style={[
            {
              position: 'absolute',
              top: 0,
              right: 37,
              backgroundColor: 'rgba(0,0,0,0.5)',
              borderBottomLeftRadius: 12,
              borderTopRightRadius: 8,
              padding: 12,
              zIndex: 10
            },
            rCloseButtonStyle
          ]}
        >
          <AnimatedTouchableOpacity
            testID="corner-delete-button"
            animatedProps={animatedCloseButtonProps as any}
            onPress={handleDelete}
          >
            <Ionicons name="close" size={20} color="white" />
          </AnimatedTouchableOpacity>
        </Animated.View>
      </Animated.View>
    );
  }
);

export default HistoryItem;
