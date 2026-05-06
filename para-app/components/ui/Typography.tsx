import { Text, TextProps } from 'react-native';
import { COLORS } from '@/lib/constants';

interface TypographyProps extends TextProps {
  variant?: 'display' | 'headline' | 'title' | 'body' | 'label';
  color?: string;
}

const STYLES: Record<string, { fontSize: number; fontFamily: string; lineHeight: number }> = {
  display: { fontSize: 56, fontFamily: 'SpaceGrotesk_700Bold', lineHeight: 64 },
  headline: { fontSize: 28, fontFamily: 'SpaceGrotesk_700Bold', lineHeight: 36 },
  title: { fontSize: 22, fontFamily: 'Manrope_700Bold', lineHeight: 28 },
  body: { fontSize: 14, fontFamily: 'Manrope_400Regular', lineHeight: 22 },
  label: { fontSize: 11, fontFamily: 'Manrope_600SemiBold', lineHeight: 16 },
};

export function Typography({
  variant = 'body',
  color = COLORS.onSurface,
  style,
  ...props
}: TypographyProps) {
  const variantStyle = STYLES[variant];
  return (
    <Text
      style={[{ color, ...variantStyle }, style]}
      {...props}
    />
  );
}
