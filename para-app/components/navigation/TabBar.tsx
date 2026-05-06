import { View, Pressable, StyleSheet } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Typography } from '@/components/ui/Typography';
import { COLORS } from '@/lib/constants';

type TabName = 'commute' | 'drive' | 'report' | 'activity' | 'profile';

const TABS: Record<
  TabName,
  { label: string; icon: keyof typeof Ionicons.glyphMap; iconActive: keyof typeof Ionicons.glyphMap }
> = {
  commute: { label: 'Commute', icon: 'map-outline', iconActive: 'map' },
  drive: { label: 'Drive', icon: 'car-outline', iconActive: 'car' },
  report: { label: 'Report', icon: 'flag-outline', iconActive: 'flag' },
  activity: { label: 'Activity', icon: 'sparkles-outline', iconActive: 'sparkles' },
  profile: { label: 'Profile', icon: 'person-outline', iconActive: 'person' },
};

export function TabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: insets.bottom + 8,
        },
      ]}
    >
      {state.routes.map((route, index) => {
        const isActive = state.index === index;
        const tab = TABS[route.name as TabName] ?? TABS.commute;
        const iconName = isActive ? tab.iconActive : tab.icon;
        const color = isActive ? COLORS.primary : COLORS.outline;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isActive && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            style={({ pressed }) => [
              styles.tab,
              { opacity: pressed ? 0.55 : 1 },
            ]}
          >
            <View style={styles.iconWrap}>
              {isActive && <View style={styles.activePill} />}
              <Ionicons name={iconName} size={22} color={color} />
            </View>
            <Typography
              numberOfLines={1}
              color={color}
              style={{
                fontSize: 10,
                marginTop: 4,
                width: '100%',
                textAlign: 'center',
                fontFamily: isActive ? 'Manrope_700Bold' : 'Manrope_500Medium',
                letterSpacing: 0.2,
              }}
            >
              {tab.label}
            </Typography>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'rgba(247, 249, 251, 0.97)',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 12,
    paddingHorizontal: 0,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 16,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 2,
  },
  iconWrap: {
    width: 48,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activePill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 14,
    backgroundColor: `${COLORS.primaryFixedDim}66`,
  },
});
