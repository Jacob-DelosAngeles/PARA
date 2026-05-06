import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Typography } from '@/components/ui/Typography';
import { Badge } from '@/components/ui/Badge';
import { COLORS } from '@/lib/constants';

interface ArrivalPlateProps {
  minutesAway: number;
  routeId: string;
  routeName: string;
  driverName?: string;
  rating?: number;
}

export function ArrivalPlate({
  minutesAway,
  routeId,
  routeName,
  driverName = 'Rogelio S.',
  rating = 4.9,
}: ArrivalPlateProps) {
  return (
    <View
      style={{
        backgroundColor: COLORS.surfaceContainerLowest,
        borderRadius: 28,
        padding: 22,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.08,
        shadowRadius: 28,
        elevation: 6,
      }}
    >
      {/* Top row: NEXT ARRIVAL label + LIVE badge */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <Typography
          variant="label"
          color={COLORS.outline}
          style={{ fontFamily: 'Manrope_700Bold', letterSpacing: 1 }}
        >
          NEXT ARRIVAL
        </Typography>
        <Badge label="LIVE" variant="live" />
      </View>

      {/* Hero row: time + route info */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 14 }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 6 }}>
          <Typography
            style={{
              fontFamily: 'SpaceGrotesk_700Bold',
              fontSize: 64,
              color: COLORS.primary,
              lineHeight: 64,
              letterSpacing: -3,
            }}
          >
            {minutesAway}
          </Typography>
          <Typography
            style={{
              fontFamily: 'SpaceGrotesk_400Regular',
              fontSize: 18,
              color: COLORS.outline,
              marginBottom: 6,
            }}
          >
            mins
          </Typography>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Typography
            style={{
              fontFamily: 'SpaceGrotesk_700Bold',
              fontSize: 18,
              color: COLORS.onSurface,
            }}
          >
            Route {routeId}
          </Typography>
          <Typography variant="body" color={COLORS.outline} style={{ fontSize: 13 }}>
            {routeName}
          </Typography>
        </View>
      </View>

      {/* Driver row */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: COLORS.surfaceContainerLow,
          borderRadius: 14,
          padding: 12,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: COLORS.primaryFixed,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="person" size={16} color={COLORS.primary} />
          </View>
          <View>
            <Typography
              variant="label"
              color={COLORS.outline}
              style={{ fontSize: 10, fontFamily: 'Manrope_600SemiBold', letterSpacing: 0.5 }}
            >
              DRIVER
            </Typography>
            <Typography variant="body" color={COLORS.onSurface} style={{ fontFamily: 'Manrope_700Bold' }}>
              {driverName}
            </Typography>
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Ionicons name="star" size={14} color="#f59e0b" />
          <Typography variant="body" color={COLORS.onSurface} style={{ fontFamily: 'Manrope_700Bold' }}>
            {rating}
          </Typography>
        </View>
      </View>
    </View>
  );
}
