import { View, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TopAppBar } from '@/components/navigation/TopAppBar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Typography } from '@/components/ui/Typography';
import { COLORS } from '@/lib/constants';
import { useAuthStore } from '@/store/authStore';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';

type Role = 'commuter' | 'driver';

export default function ProfileScreen() {
  const router = useRouter();
  const { profile, session, isGuest, setProfile } = useAuthStore();
  const { signOut } = useAuth();

  async function handleRoleSwitch(newRole: Role) {
    if (!session || !profile) return;
    const { data } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', session.user.id)
      .select()
      .single();
    if (data) setProfile(data);
  }

  async function handleSignOut() {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: signOut },
    ]);
  }

  const initials = profile?.display_name
    ? profile.display_name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  if (isGuest) {
    const PERKS = [
      { icon: 'sparkles' as const, title: 'Earn PARA Points', sub: 'Get rewarded for reporting incidents and validating community reports.' },
      { icon: 'bookmark' as const, title: 'Save your routes', sub: 'Pin frequent commutes for one-tap arrival times.' },
      { icon: 'shield-checkmark' as const, title: 'Trusted reports', sub: 'Verified accounts reduce spam and improve data quality.' },
    ];

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.surface }}>
        <TopAppBar title="Profile" showWordmark={false} />
        <View style={{ flex: 1, padding: 16, paddingTop: 72 }}>
          <Card variant="lowest" padding={28} radius={24} style={{ alignItems: 'center', gap: 12 }}>
            <View
              style={{
                width: 88,
                height: 88,
                borderRadius: 44,
                backgroundColor: `${COLORS.primary}10`,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="person" size={40} color={COLORS.primary} />
            </View>
            <Typography
              style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 22, color: COLORS.onSurface }}
            >
              Guest User
            </Typography>
            <Typography variant="body" color={COLORS.outline} style={{ textAlign: 'center', lineHeight: 20 }}>
              Sign in to unlock everything PARA offers.
            </Typography>
          </Card>

          {/* Perks list */}
          <View style={{ marginTop: 20, gap: 10 }}>
            {PERKS.map((p) => (
              <View
                key={p.title}
                style={{
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  gap: 14,
                  paddingHorizontal: 4,
                }}
              >
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 12,
                    backgroundColor: `${COLORS.primary}10`,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Ionicons name={p.icon} size={18} color={COLORS.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Typography
                    color={COLORS.onSurface}
                    style={{ fontFamily: 'Manrope_700Bold', fontSize: 14, marginBottom: 2 }}
                  >
                    {p.title}
                  </Typography>
                  <Typography variant="body" color={COLORS.outline} style={{ fontSize: 12, lineHeight: 17 }}>
                    {p.sub}
                  </Typography>
                </View>
              </View>
            ))}
          </View>

          <View style={{ flex: 1 }} />

          <View style={{ gap: 10 }}>
            <Button
              label="Create Account"
              variant="primary"
              size="lg"
              fullWidth
              onPress={() => router.replace('/(auth)/sign-up')}
            />
            <Button
              label="Sign In"
              variant="secondary"
              size="md"
              fullWidth
              onPress={() => router.replace('/(auth)/sign-in')}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.surface }}>
      <TopAppBar title="Profile" showWordmark={false} />
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingTop: 72, gap: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar section */}
        <Card variant="lowest" padding={28} radius={24} style={{ alignItems: 'center', gap: 14 }}>
          <View
            style={{
              width: 96,
              height: 96,
              borderRadius: 48,
              backgroundColor: COLORS.primary,
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: COLORS.primary,
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.25,
              shadowRadius: 18,
              elevation: 6,
            }}
          >
            <Typography
              style={{
                fontFamily: 'SpaceGrotesk_700Bold',
                fontSize: 36,
                color: COLORS.onPrimary,
                letterSpacing: -1,
              }}
            >
              {initials}
            </Typography>
          </View>
          <Typography
            style={{
              fontFamily: 'SpaceGrotesk_700Bold',
              fontSize: 24,
              color: COLORS.onSurface,
            }}
          >
            {profile?.display_name ?? 'User'}
          </Typography>
          <Typography variant="body" color={COLORS.outline}>
            {session?.user.email}
          </Typography>
        </Card>

        {/* Stats */}
        <Card variant="lowest" padding={20} radius={20}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            <View style={{ alignItems: 'center', gap: 4 }}>
              <Typography
                style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 32, color: COLORS.primary, letterSpacing: -1 }}
              >
                {profile?.points ?? 0}
              </Typography>
              <Typography variant="label" color={COLORS.outline}>
                POINTS
              </Typography>
            </View>
            <View style={{ alignItems: 'center', gap: 4 }}>
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  backgroundColor: `${COLORS.primary}10`,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Ionicons
                  name={profile?.role === 'driver' ? 'car' : 'walk'}
                  size={22}
                  color={COLORS.primary}
                />
              </View>
              <Typography variant="label" color={COLORS.outline} style={{ textTransform: 'uppercase' }}>
                {profile?.role}
              </Typography>
            </View>
          </View>
        </Card>

        {/* Role switcher */}
        <Card variant="lowest" padding={20} radius={20}>
          <Typography
            variant="label"
            color={COLORS.onSurfaceVariant}
            style={{ fontFamily: 'Manrope_600SemiBold', marginBottom: 12, letterSpacing: 0.5 }}
          >
            I AM A...
          </Typography>
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: COLORS.surfaceContainerHigh,
              borderRadius: 14,
              padding: 4,
            }}
          >
            {(['commuter', 'driver'] as Role[]).map((r) => {
              const active = profile?.role === r;
              return (
                <Pressable
                  key={r}
                  onPress={() => handleRoleSwitch(r)}
                  style={({ pressed }) => ({
                    flex: 1,
                    opacity: pressed ? 0.85 : 1,
                  })}
                >
                  <View
                    pointerEvents="none"
                    style={{
                      width: '100%',
                      paddingVertical: 12,
                      borderRadius: 10,
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 4,
                      backgroundColor: active ? COLORS.primary : 'transparent',
                    }}
                  >
                    <Ionicons
                      name={r === 'commuter' ? 'walk' : 'car'}
                      size={18}
                      color={active ? COLORS.onPrimary : COLORS.onSurfaceVariant}
                    />
                    <Typography
                      color={active ? COLORS.onPrimary : COLORS.onSurfaceVariant}
                      style={{ fontFamily: 'Manrope_700Bold', textTransform: 'capitalize', fontSize: 12 }}
                    >
                      {r}
                    </Typography>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </Card>

        {/* Sign out */}
        <Button
          label="Sign Out"
          variant="ghost"
          size="md"
          fullWidth
          onPress={handleSignOut}
          style={{ marginTop: 4 }}
        />

        <View style={{ height: 16 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
