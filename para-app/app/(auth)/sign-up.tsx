import { useState } from 'react';
import { View, TextInput, Alert, ScrollView, StatusBar, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { COLORS } from '@/lib/constants';

type Role = 'commuter' | 'driver';

export default function SignUpScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('commuter');
  const [loading, setLoading] = useState(false);

  async function handleSignUp() {
    if (!name || !email || !password) {
      Alert.alert('Missing fields', 'Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Weak password', 'Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: name, role } },
    });
    setLoading(false);
    if (error) {
      Alert.alert('Sign up failed', error.message);
    }
    // AuthGate will redirect on session change
  }

  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView edges={['bottom']} style={{ flex: 1, backgroundColor: COLORS.surface }}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingTop: insets.top + 16, paddingBottom: 24 }}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => ({
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            marginBottom: 24,
            opacity: pressed ? 0.6 : 1,
          })}
        >
          <Ionicons name="chevron-back" size={18} color={COLORS.primary} />
          <Typography variant="label" color={COLORS.primary} style={{ fontFamily: 'Manrope_600SemiBold' }}>
            Back
          </Typography>
        </Pressable>

        <Typography
          style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 36, lineHeight: 42, color: COLORS.onSurface, marginBottom: 8, letterSpacing: -1 }}
        >
          Create Account
        </Typography>
        <Typography variant="body" color={COLORS.outline} style={{ marginBottom: 32 }}>
          Join PARA and take control of your commute.
        </Typography>

        <Card variant="low" padding={24} style={{ gap: 16 }}>
          <View style={{ gap: 8 }}>
            <Typography variant="label" color={COLORS.onSurfaceVariant} style={{ fontFamily: 'Manrope_600SemiBold' }}>
              Full Name
            </Typography>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Juan dela Cruz"
              placeholderTextColor={COLORS.outlineVariant}
              style={INPUT_STYLE}
            />
          </View>

          <View style={{ gap: 8 }}>
            <Typography variant="label" color={COLORS.onSurfaceVariant} style={{ fontFamily: 'Manrope_600SemiBold' }}>
              Email
            </Typography>
            <TextInput
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="you@example.com"
              placeholderTextColor={COLORS.outlineVariant}
              style={INPUT_STYLE}
            />
          </View>

          <View style={{ gap: 8 }}>
            <Typography variant="label" color={COLORS.onSurfaceVariant} style={{ fontFamily: 'Manrope_600SemiBold' }}>
              Password
            </Typography>
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="Min. 6 characters"
              placeholderTextColor={COLORS.outlineVariant}
              style={INPUT_STYLE}
            />
          </View>

          {/* Role Selector */}
          <View style={{ gap: 8 }}>
            <Typography variant="label" color={COLORS.onSurfaceVariant} style={{ fontFamily: 'Manrope_600SemiBold' }}>
              I am a...
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
                const active = role === r;
                return (
                  <Pressable
                    key={r}
                    onPress={() => setRole(r)}
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
                        backgroundColor: active ? COLORS.primary : 'transparent',
                      }}
                    >
                      <Typography
                        color={active ? COLORS.onPrimary : COLORS.onSurfaceVariant}
                        style={{ fontFamily: 'Manrope_700Bold', textTransform: 'capitalize', fontSize: 13 }}
                      >
                        {r}
                      </Typography>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </Card>

        <Button
          label={loading ? 'Creating Account...' : 'Create Account'}
          variant="primary"
          size="lg"
          fullWidth
          disabled={loading}
          onPress={handleSignUp}
          style={{ marginTop: 24 }}
        />

        <Pressable
          onPress={() => router.push('/(auth)/sign-in')}
          style={{ alignItems: 'center', marginTop: 20 }}
        >
          <Typography variant="body" color={COLORS.outline}>
            Already have an account?{' '}
            <Typography variant="body" color={COLORS.primary} style={{ fontFamily: 'Manrope_700Bold' }}>
              Sign in
            </Typography>
          </Typography>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const INPUT_STYLE = {
  backgroundColor: COLORS.surfaceContainerLowest,
  borderRadius: 12,
  padding: 14,
  fontFamily: 'Manrope_400Regular',
  fontSize: 14,
  color: COLORS.onSurface,
  borderWidth: 1,
  borderColor: `${COLORS.outlineVariant}26`,
} as const;
