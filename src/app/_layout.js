import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import { AppProvider, useApp } from '../context/AppContext';
import { themes } from '../theme';

function ThemedApp() {
  const { themeMode } = useApp();
  const theme = themes[themeMode] ?? themes.light;
  return (
    <PaperProvider theme={theme}>
      <StatusBar style={theme.dark ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.colors.background } }} />
    </PaperProvider>
  );
}

export default function Layout() {
  return (
    <AppProvider>
      <ThemedApp />
    </AppProvider>
  );
}
