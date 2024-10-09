import Colors from '@/constants/Colors';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as NavigationBar from 'expo-navigation-bar';
import { Tabs } from 'expo-router';
import { useEffect } from 'react';
import { Platform } from 'react-native';

async function setAndroidNavigationBar() {
  if (Platform.OS !== 'android') return;
  await NavigationBar.setButtonStyleAsync('dark');
  await NavigationBar.setBackgroundColorAsync(Colors.primary);
}

export default function TabsLayout() {
  useEffect(() => {
    // Set the Android navigation bar color when the component mounts
    setAndroidNavigationBar(); // or 'light', depending on your theme
  }, []);

  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary },
        headerTitleStyle: { color: Colors.text },
        headerTintColor: Colors.text,
        headerTitleAlign: 'center',
        tabBarStyle: {
          backgroundColor: Colors.primary,
          // You might want to add these for better styling:
          borderTopWidth: 0,
          elevation: 4, // for Android
          shadowOpacity: 0 // for iOS
        },
        tabBarActiveTintColor: Colors.text,
        tabBarInactiveTintColor: Colors.muted
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Plant Identifier',
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="home" size={size} color={color} />
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'Scan History',
          tabBarLabel: 'History',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="history" size={size} color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="settings" size={size} color={color} />
          )
        }}
      />
    </Tabs>
  );
}
