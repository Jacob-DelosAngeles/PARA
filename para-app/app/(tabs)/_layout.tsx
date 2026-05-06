import { Tabs } from 'expo-router';
import { TabBar } from '@/components/navigation/TabBar';

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="commute" options={{ title: 'Commute' }} />
      <Tabs.Screen name="drive" options={{ title: 'Drive' }} />
      <Tabs.Screen name="report" options={{ title: 'Report' }} />
      <Tabs.Screen name="activity" options={{ title: 'Activity' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
