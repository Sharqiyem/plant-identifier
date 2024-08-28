import { Link, Stack } from 'expo-router';
import { Theme, ThemeProvider } from '@react-navigation/native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const AppTheme: Theme = {
  dark: false,
  colors: {
    primary: '#10B981',
    background: 'white',
    card: 'rgb(255, 255, 255)',
    text: 'rgb(28, 28, 30)',
    border: 'rgb(216, 216, 216)',
    notification: 'rgb(255, 59, 48)'
  }
};

export default function Layout() {
  return (
    <ThemeProvider value={AppTheme}>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: 'Plant Identifier',
            headerRight: () => (
              <Link href="/history">
                <MaterialIcons name="history" size={24} color="black" />
              </Link>
            )
          }}
        />
        <Stack.Screen
          name="history"
          options={{
            title: 'Scan History'
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
