import { Tabs, Stack } from 'expo-router';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

export default function ParentLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="map" options={{ headerShown: false }} />
    </Stack>
  );
}
