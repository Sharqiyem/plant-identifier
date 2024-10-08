import { Slot } from 'expo-router';
import { Theme, ThemeProvider } from '@react-navigation/native';
import Colors from '@/constants/Colors';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

const AppTheme: Theme = {
  dark: true,
  colors: Colors
};

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Animated.View style={{ flex: 1 }}>
        <ThemeProvider value={AppTheme}>
          <StatusBar backgroundColor={Colors.primary} style="light" />
          <Slot />
        </ThemeProvider>
      </Animated.View>
    </GestureHandlerRootView>
  );
}
