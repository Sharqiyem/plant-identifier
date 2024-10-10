import Colors from '@/constants/Colors';
import { hslStringToRgb } from '@/lib/helpers';
import React from 'react';
import { View } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming
} from 'react-native-reanimated';

// const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Helper function to lighten a color
// const lightenColor = (color: string, amount: number): string => {
//   const [h, s, l] = color.match(/\d+/g)!.map(Number);
//   const newL = Math.min(l + amount, 100);
//   return `hsl(${h} ${s}% ${newL}%)`;
// };

const baseColor = hslStringToRgb(Colors.card);
const lighterColor = hslStringToRgb(Colors.border); // Adjust the 5 to make it more or less light

const HistoryItemSkeleton = () => {
  const animation = useSharedValue(0);

  React.useEffect(() => {
    animation.value = withRepeat(withTiming(1, { duration: 1500 }), -1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animatedBackground = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(animation.value, [0, 1], [baseColor, lighterColor]);
    return { backgroundColor };
  });

  return (
    <View className="mb-4 ">
      <Animated.View
        className="rounded-lg overflow-hidden    "
        // style={[{ width: SCREEN_WIDTH - 32 }]}
      >
        <Animated.View className="w-full h-40  " style={animatedBackground} />
        <View className="px-2 bg-border/90 ">
          <Animated.View className="h-6 w-3/4 mb-2 rounded" style={animatedBackground} />
          <Animated.View className="h-4 w-1/2 mb-2 rounded" style={animatedBackground} />
          <Animated.View className="h-4 w-1/4 rounded" style={animatedBackground} />
        </View>
      </Animated.View>
    </View>
  );
};

export default HistoryItemSkeleton;
