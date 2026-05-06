import { View, ViewProps } from 'react-native';
import { Typography } from './Typography';
import { COLORS } from '@/lib/constants';

interface BadgeProps extends ViewProps {
  label: string;
  variant?: 'primary' | 'live' | 'full' | 'seats' | 'neutral';
}

const BG: Record<string, string> = {
  primary: COLORS.primary,
  live: '#22c55e',
  full: COLORS.error,
  seats: COLORS.secondaryContainer,
  neutral: COLORS.surfaceContainerHigh,
};

const TEXT: Record<string, string> = {
  primary: COLORS.onPrimary,
  live: '#ffffff',
  full: '#ffffff',
  seats: COLORS.onSecondary,
  neutral: COLORS.onSurfaceVariant,
};

export function Badge({ label, variant = 'neutral', style, ...props }: BadgeProps) {
  return (
    <View
      style={[
        {
          backgroundColor: BG[variant],
          borderRadius: 999,
          paddingHorizontal: 8,
          paddingVertical: 3,
          alignSelf: 'flex-start',
        },
        style,
      ]}
      {...props}
    >
      <Typography
        variant="label"
        color={TEXT[variant]}
        style={{ fontSize: 10, fontFamily: 'Manrope_700Bold' }}
      >
        {label}
      </Typography>
    </View>
  );
}
