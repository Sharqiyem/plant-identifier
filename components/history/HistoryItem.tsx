/* eslint-disable react/display-name */
import { PlantCard } from '@/components/common/PlantCard';
import Colors from '@/constants/Colors';
import { hslStringToRgb } from '@/lib/helpers';
import { PlantWithMeta, ScanHistoryItem } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback } from 'react';
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
    onPress,
    isLoading
  }: {
    item: ScanHistoryItem;
    index: number;
    onDelete: (index: number) => void;
    onPress: (item: ScanHistoryItem) => void;
    isLoading: boolean;
  }) => {
    const firstLanguage = Object.keys(item)[0];
    const plantInfo: PlantWithMeta = item[firstLanguage];

    const translateX = useSharedValue(0);
    const isSwipeOpen = useSharedValue(false);
    const contextX = useSharedValue(0);

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

    const tapGesture = Gesture.Tap().onStart(() => {
      if (isSwipeOpen.value) {
        translateX.value = withTiming(0);
        isSwipeOpen.value = false;
      } else {
        runOnJS(onPress)(item);
      }
    });

    const composedGestures = Gesture.Simultaneous(panGesture, tapGesture);

    const handleDelete = useCallback(() => {
      onDelete(index);
    }, [onDelete, index]);

    if (isLoading) {
      return <HistoryItemSkeleton />;
    }

    return (
      <Animated.View className="mb-4" style={{ width: SCREEN_WIDTH }} layout={Layout.springify()}>
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
                <Animated.View style={{ width: SCREEN_WIDTH - Math.abs(SWIPE_THRESHOLD / 2) }}>
                  <AnimatedTouchableOpacity
                    testID="history-item-touchable"
                    animatedProps={animatedCardProps as any}
                    className="bg-card rounded-lg overflow-hidden"
                    onPress={() => onPress(item)}
                    activeOpacity={0.9}
                  >
                    <Image
                      testID="plant-image"
                      source={{ uri: plantInfo.previewUri }}
                      className="w-full h-40 object-cover"
                    />
                    <View className="p-4">
                      <PlantCard
                        testID="plant-card"
                        plant={plantInfo}
                        showTimestamp
                        timestamp={plantInfo.timestamp}
                      />
                    </View>
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
