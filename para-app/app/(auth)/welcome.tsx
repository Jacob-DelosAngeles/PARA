import { View, ScrollView, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { COLORS } from '@/lib/constants';
import { useAuthStore } from '@/store/authStore';

export default function WelcomeScreen() {
  const router = useRouter();
  const setGuest = useAuthStore((s) => s.setGuest);

  function handleGuest() {
    setGuest(true);
    router.replace('/(tabs)/commute');
  }

  const FEATURES = [
    { icon: 'time-outline' as const, label: 'Real-time arrivals' },
    { icon: 'trending-up-outline' as const, label: 'Live demand pulse' },
    { icon: 'shield-checkmark-outline' as const, label: 'Community-verified' },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.surface }}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, padding: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Top brand bar */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 12,
          }}
        >
          <Typography
            style={{
              fontFamily: 'SpaceGrotesk_700Bold',
              fontSize: 20,
              color: COLORS.primary,
              letterSpacing: -0.3,
            }}
          >
            PARA
          </Typography>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 999,
              backgroundColor: `${COLORS.primary}10`,
            }}
          >
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#22c55e' }} />
            <Typography
              variant="label"
              color={COLORS.primary}
              style={{ fontFamily: 'Manrope_700Bold', letterSpacing: 0.3 }}
            >
              MNL · Live
            </Typography>
          </View>
        </View>

        {/* Hero */}
        <View style={{ flex: 1, justifyContent: 'center', paddingVertical: 32 }}>
          <Typography
            style={{
              fontFamily: 'SpaceGrotesk_700Bold',
              fontSize: 88,
              color: COLORS.primary,
              lineHeight: 88,
              letterSpacing: -4,
            }}
          >
            PARA
          </Typography>
          <Typography
            style={{
              fontFamily: 'SpaceGrotesk_700Bold',
              fontSize: 28,
              color: COLORS.onSurface,
              lineHeight: 32,
              marginTop: 12,
              letterSpacing: -0.5,
            }}
          >
            Real-time jeepney{'\n'}intelligence.
          </Typography>
          <Typography
            variant="body"
            color={COLORS.outline}
            style={{ marginTop: 14, lineHeight: 22, fontSize: 15 }}
          >
            Know when the next jeepney arrives.{'\n'}
            Drivers know where passengers wait.
          </Typography>

          {/* Feature pills */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 24 }}>
            {FEATURES.map((f) => (
              <View
                key={f.label}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderRadius: 999,
                  backgroundColor: COLORS.surfaceContainerLowest,
                  shadowColor: COLORS.primary,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.04,
                  shadowRadius: 8,
                  elevation: 1,
                }}
              >
                <Ionicons name={f.icon} size={13} color={COLORS.primary} />
                <Typography
                  variant="label"
                  color={COLORS.onSurfaceVariant}
                  style={{ fontFamily: 'Manrope_700Bold', fontSize: 11 }}
                >
                  {f.label}
                </Typography>
              </View>
            ))}
          </View>
        </View>

        {/* Actions */}
        <View style={{ gap: 10, paddingBottom: 8 }}>
          <Button
            label="Create Account"
            variant="primary"
            size="lg"
            fullWidth
            onPress={() => router.push('/(auth)/sign-up')}
          />
          <Button
            label="Sign In"
            variant="secondary"
            size="lg"
            fullWidth
            onPress={() => router.push('/(auth)/sign-in')}
          />
          <Button
            label="Continue as Guest"
            variant="ghost"
            size="md"
            fullWidth
            onPress={handleGuest}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
