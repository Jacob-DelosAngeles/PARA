import { View, Pressable } from 'react-native';
import { Typography } from '@/components/ui/Typography';
import { Badge } from '@/components/ui/Badge';
import { COLORS } from '@/lib/constants';
import type { RouteInfo } from '@/types';

interface NearbyRouteCardProps {
  route: RouteInfo;
  onPress?: () => void;
}

export function NearbyRouteCard({ route, onPress }: NearbyRouteCardProps) {
  const statusVariant =
    route.status === 'Full' ? 'full' : route.status === 'Seats Left' ? 'seats' : 'neutral';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        backgroundColor: COLORS.surfaceContainerLowest,
        borderRadius: 16,
        opacity: pressed ? 0.85 : 1,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 1,
      })}
    >
      {/* Route code badge */}
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          backgroundColor: COLORS.primaryFixed,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 12,
        }}
      >
        <Typography
          style={{
            fontFamily: 'SpaceGrotesk_700Bold',
            fontSize: 13,
            color: COLORS.primary,
          }}
        >
          {route.id}
        </Typography>
      </View>

      {/* Route info */}
      <View style={{ flex: 1 }}>
        <Typography variant="title" color={COLORS.onSurface} style={{ fontSize: 14, marginBottom: 2 }}>
          {route.name}
        </Typography>
        <Typography variant="body" color={COLORS.outline} style={{ fontSize: 12 }}>
          {route.subtitle}
        </Typography>
      </View>

      {/* Right side */}
      <View style={{ alignItems: 'flex-end', gap: 4 }}>
        <Typography
          style={{
            fontFamily: 'SpaceGrotesk_700Bold',
            fontSize: 18,
            color: route.wait <= 5 ? COLORS.secondary : COLORS.onSurface,
          }}
        >
          {route.wait}m
        </Typography>
        {route.status && (
          <Badge label={route.status} variant={statusVariant as 'full' | 'seats' | 'neutral'} />
        )}
      </View>
    </Pressable>
  );
}
