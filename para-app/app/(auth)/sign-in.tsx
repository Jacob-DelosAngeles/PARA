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

export default function SignInScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignIn() {
    if (!email || !password) {
      Alert.alert('Missing fields', 'Please enter your email and password.');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setLoading(false);
    if (error) {
      // Supabase returns generic "Invalid login credentials" for both wrong-password
      // and unconfirmed-email to prevent enumeration. Surface the hint up front.
      const msg = error.message.toLowerCase();
      if (msg.includes('invalid login') || msg.includes('email not confirmed')) {
        Alert.alert(
          'Sign in failed',
          `${error.message}\n\nIf you just signed up, your email may need to be confirmed. ` +
            `Check your inbox, or ask the developer to disable email confirmation in the ` +
            `Supabase dashboard for the MVP.`
        );
      } else {
        Alert.alert('Sign in failed', error.message);
      }
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
          Sign In
        </Typography>
        <Typography variant="body" color={COLORS.outline} style={{ marginBottom: 32 }}>
          Welcome back to PARA.
        </Typography>

        <Card variant="low" padding={24} style={{ gap: 16 }}>
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
              placeholder="••••••••"
              placeholderTextColor={COLORS.outlineVariant}
              style={INPUT_STYLE}
            />
          </View>
        </Card>

        <Button
          label={loading ? 'Signing In...' : 'Sign In'}
          variant="primary"
          size="lg"
          fullWidth
          disabled={loading}
          onPress={handleSignIn}
          style={{ marginTop: 24 }}
        />

        <Pressable
          onPress={() => router.push('/(auth)/sign-up')}
          style={{ alignItems: 'center', marginTop: 20 }}
        >
          <Typography variant="body" color={COLORS.outline}>
            Don't have an account?{' '}
            <Typography variant="body" color={COLORS.primary} style={{ fontFamily: 'Manrope_700Bold' }}>
              Create one
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
