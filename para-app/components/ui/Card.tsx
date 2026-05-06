import { View, ViewProps } from 'react-native';
import { COLORS } from '@/lib/constants';

interface CardProps extends ViewProps {
  variant?: 'lowest' | 'low' | 'base' | 'high';
  padding?: number;
  radius?: number;
}

const BG: Record<string, string> = {
  lowest: COLORS.surfaceContainerLowest,
  low: COLORS.surfaceContainerLow,
  base: COLORS.surfaceContainer,
  high: COLORS.surfaceContainerHigh,
};

export function Card({
  variant = 'lowest',
  padding = 20,
  radius = 16,
  style,
  ...props
}: CardProps) {
  return (
    <View
      style={[
        {
          backgroundColor: BG[variant],
          borderRadius: radius,
          padding,
          shadowColor: COLORS.primary,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.06,
          shadowRadius: 24,
          elevation: 2,
        },
        style,
      ]}
      {...props}
    />
  );
}
