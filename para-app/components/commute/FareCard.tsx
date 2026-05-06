import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Typography } from '@/components/ui/Typography';
import { COLORS } from '@/lib/constants';
import { haversineKm, farePhp } from '@/lib/geo';
import type { Coords } from '@/types';

interface FareCardProps {
  origin: Coords;
  destination: Coords;
}

export function FareCard({ origin, destination }: FareCardProps) {
  const distanceKm = haversineKm(origin, destination);
  const fare = farePhp(distanceKm);

  return (
    <View
      style={{
        backgroundColor: COLORS.surfaceContainerLowest,
        borderRadius: 20,
        padding: 18,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.06,
        shadowRadius: 16,
        elevation: 3,
      }}
    >
      <View
        style={{
          width: 52,
          height: 52,
          borderRadius: 16,
          backgroundColor: `${COLORS.primary}10`,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Ionicons name="cash-outline" size={26} color={COLORS.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Typography
          variant="label"
          color={COLORS.outline}
          style={{ fontFamily: 'Manrope_600SemiBold', letterSpacing: 0.5 }}
        >
          ESTIMATED FARE
        </Typography>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8, marginTop: 2 }}>
          <Typography
            style={{
              fontFamily: 'SpaceGrotesk_700Bold',
              fontSize: 32,
              color: COLORS.primary,
              letterSpacing: -1,
              lineHeight: 36,
            }}
          >
            ₱{fare}
          </Typography>
          <Typography variant="body" color={COLORS.outline} style={{ fontSize: 13 }}>
            · {distanceKm.toFixed(1)} km
          </Typography>
        </View>
        <Typography
          variant="label"
          color={COLORS.outline}
          style={{ fontSize: 10, marginTop: 2 }}
        >
          LTFRB regulated · Cash only
        </Typography>
      </View>
    </View>
  );
}
