import { Pressable, View, StyleSheet, PressableProps, ViewStyle } from 'react-native';
import { Typography } from './Typography';
import { COLORS } from '@/lib/constants';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<PressableProps, 'style'> {
  label: string;
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  /** When > 0 with cooldownStartedAt set, button disables and shows countdown overlay. */
  cooldownMs?: number;
  cooldownRemainingMs?: number;
  style?: ViewStyle;
}

const HEIGHT: Record<Size, number> = { sm: 40, md: 52, lg: 56 };
const FONT_SIZE: Record<Size, number> = { sm: 13, md: 14, lg: 15 };

const BG: Record<Variant, string> = {
  primary: COLORS.primary,
  secondary: COLORS.secondaryContainer,
  ghost: 'transparent',
};

const TEXT: Record<Variant, string> = {
  primary: COLORS.onPrimary,
  secondary: COLORS.onSecondary,
  ghost: COLORS.primary,
};

function formatRemaining(ms: number) {
  const totalSec = Math.ceil(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function Button({
  label,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  leadingIcon,
  trailingIcon,
  cooldownMs = 0,
  cooldownRemainingMs = 0,
  style,
  disabled,
  ...props
}: ButtonProps) {
  const height = HEIGHT[size];
  const bg = BG[variant];
  const fg = TEXT[variant];
  const isFilled = variant !== 'ghost';

  const inCooldown = cooldownMs > 0 && cooldownRemainingMs > 0;
  const effectiveDisabled = disabled || inCooldown;
  const progress = inCooldown ? 1 - cooldownRemainingMs / cooldownMs : 1;

  return (
    <Pressable
      disabled={effectiveDisabled}
      style={({ pressed }) => [
        styles.outer,
        {
          height,
          opacity: effectiveDisabled ? (inCooldown ? 0.85 : 0.45) : pressed ? 0.85 : 1,
          width: fullWidth ? '100%' : undefined,
          transform: [{ scale: pressed && !effectiveDisabled ? 0.98 : 1 }],
        },
        style,
      ]}
      {...props}
    >
      <View
        pointerEvents="none"
        style={[
          styles.inner,
          {
            height,
            backgroundColor: inCooldown ? COLORS.surfaceContainerHigh : bg,
            shadowColor: COLORS.primary,
            shadowOffset: { width: 0, height: isFilled && !inCooldown ? 6 : 0 },
            shadowOpacity: isFilled && !inCooldown ? 0.18 : 0,
            shadowRadius: isFilled && !inCooldown ? 18 : 0,
            elevation: isFilled && !inCooldown ? 6 : 0,
          },
        ]}
      >
        {/* Cooldown progress fill (left-to-right) */}
        {inCooldown && (
          <View
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: `${progress * 100}%`,
              backgroundColor: `${COLORS.primary}22`,
              borderRadius: 16,
            }}
          />
        )}

        {!inCooldown && leadingIcon && <View style={styles.icon}>{leadingIcon}</View>}
        <Typography
          variant="label"
          color={inCooldown ? COLORS.onSurfaceVariant : fg}
          style={{ fontSize: FONT_SIZE[size], fontFamily: 'Manrope_700Bold', letterSpacing: 0.3 }}
        >
          {inCooldown ? `Wait ${formatRemaining(cooldownRemainingMs)}` : label}
        </Typography>
        {!inCooldown && trailingIcon && <View style={styles.icon}>{trailingIcon}</View>}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  outer: {
    borderRadius: 16,
  },
  inner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    paddingHorizontal: 24,
    gap: 8,
    overflow: 'hidden',
  },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
