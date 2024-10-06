// import '@/styles/global.css';

import { Link, Stack } from 'expo-router';
import { Theme, ThemeProvider } from '@react-navigation/native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Colors from '@/constants/Colors';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

const AppTheme: Theme = {
  dark: true,
  colors: Colors
};

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Animated.View style={{ flex: 1 }}>
        <ThemeProvider value={AppTheme}>
          <StatusBar backgroundColor={Colors.primary} style="light" />
          <Stack
            screenOptions={{
              headerStyle: { backgroundColor: Colors.primary },
              headerTitleStyle: { color: Colors.text },
              headerTintColor: Colors.text,
              headerTitleAlign: 'center'
            }}
          >
            <Stack.Screen
              name="index"
              options={{
                title: 'Plant Identifier',
                headerStyle: { backgroundColor: Colors.primary },
                headerTitleStyle: { color: Colors.text },
                headerTintColor: Colors.text,
                headerTitleAlign: 'center',
                headerRight: () => (
                  <View className="flex-row">
                    <Link href="/settings" className="mr-4">
                      <MaterialIcons name="settings" size={32} color={Colors.text} />
                    </Link>
                    <Link href="/history">
                      <MaterialIcons name="history" size={32} color={Colors.text} />
                    </Link>
                  </View>
                )
              }}
              key="index"
            />
            <Stack.Screen
              name="history"
              options={{
                title: 'Scan History'
              }}
              key="history"
            />
            <Stack.Screen
              name="settings"
              options={{
                title: 'Settings'
              }}
              key="settings"
            />
          </Stack>
        </ThemeProvider>
      </Animated.View>
    </GestureHandlerRootView>
  );
}
