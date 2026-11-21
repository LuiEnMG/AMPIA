import { router, Tabs } from 'expo-router';
import { IconButton, useTheme } from 'react-native-paper';
import { Text } from 'react-native';
import AppHeader from '../../components/AppHeader';

export default function TabsLayout() {
  const { colors } = useTheme();
  return (
    <Tabs screenOptions={{
      headerShown: true,
      headerTitle: () => <AppHeader />,
      headerTitleAlign: 'left',
      headerRight: () => <IconButton icon="cog-outline" iconColor={colors.text} onPress={() => router.push('/settings')} />,
      headerStyle: { backgroundColor: colors.surface },
      headerTintColor: colors.text,
      sceneStyle: { backgroundColor: colors.background },
      tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.mutedText,
      tabBarLabelStyle: { fontWeight: '600' },
    }}>
      <Tabs.Screen name="products" options={{ title: 'Productos', tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>P</Text> }} />
      <Tabs.Screen name="orders" options={{ title: 'Pedidos', tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>O</Text> }} />
      <Tabs.Screen name="calendar" options={{ title: 'Calendario', tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>C</Text> }} />
      <Tabs.Screen name="map" options={{ title: 'Mapa', tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>M</Text> }} />
    </Tabs>
  );
}
