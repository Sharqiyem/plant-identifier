import Colors from '@/constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { Theme, ThemeProvider } from '@react-navigation/native';
import * as Font from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import { LogBox, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

LogBox.ignoreLogs([
  'Property "opacity" of AnimatedComponent(View) may be overwritten by a layout animation'
]);

const AppTheme: Theme = {
  dark: true,
  colors: Colors
};

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        await Font.loadAsync(Ionicons.font);
        // Artificially delay for two seconds to simulate a slow loading
        // experience. Please remove this if you copy and paste the code!
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return <View className="flex-1 bg-background" />;
  }

  return (
    <GestureHandlerRootView
      style={{ flex: 1 }}
      className="bg-background"
      onLayout={onLayoutRootView}
    >
      <BottomSheetModalProvider>
        <Animated.View style={{ flex: 1 }}>
          <ThemeProvider value={AppTheme}>
            <StatusBar backgroundColor={Colors.primary} style="light" />
            <Stack>
              <Stack.Screen name="tabs" options={{ headerShown: false }} />
              <Stack.Screen
                name="result-modal"
                options={{
                  headerShown: false,
                  presentation: 'transparentModal',
                  animation: 'fade'
                }}
              />
            </Stack>
          </ThemeProvider>
        </Animated.View>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
