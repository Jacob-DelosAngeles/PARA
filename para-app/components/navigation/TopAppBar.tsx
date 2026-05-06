import { View, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Typography } from '@/components/ui/Typography';
import { COLORS } from '@/lib/constants';

interface TopAppBarProps {
  title?: string;
  showWordmark?: boolean;
  badge?: string;
  rightAction?: React.ReactNode;
  transparent?: boolean;
}

export function TopAppBar({
  title,
  showWordmark = true,
  badge,
  rightAction,
  transparent = false,
}: TopAppBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        paddingTop: insets.top + 8,
        paddingBottom: 12,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: transparent ? 'transparent' : 'rgba(247, 249, 251, 0.9)',
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        {showWordmark && (
          <Typography
            style={{
              fontFamily: 'SpaceGrotesk_700Bold',
              fontSize: 22,
              color: COLORS.primary,
              letterSpacing: -0.5,
            }}
          >
            PARA
          </Typography>
        )}
        {title && (
          <Typography variant="title" color={COLORS.onSurface}>
            {title}
          </Typography>
        )}
        {badge && (
          <View
            style={{
              backgroundColor: COLORS.secondaryContainer,
              borderRadius: 999,
              paddingHorizontal: 8,
              paddingVertical: 2,
            }}
          >
            <Typography
              variant="label"
              color={COLORS.onSecondary}
              style={{ fontSize: 10, fontFamily: 'Manrope_700Bold' }}
            >
              {badge}
            </Typography>
          </View>
        )}
      </View>
      {rightAction && <View>{rightAction}</View>}
    </View>
  );
}
