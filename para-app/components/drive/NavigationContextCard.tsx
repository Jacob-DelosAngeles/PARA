import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Typography } from '@/components/ui/Typography';
import { COLORS } from '@/lib/constants';

interface NavigationContextCardProps {
  nextTurn: string;
  arrival: string;
  timeToArrival: number;
}

export function NavigationContextCard({
  nextTurn,
  arrival,
  timeToArrival,
}: NavigationContextCardProps) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: COLORS.surfaceContainerLowest,
        borderRadius: 20,
        paddingVertical: 16,
        paddingHorizontal: 18,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.08,
        shadowRadius: 18,
        elevation: 4,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 14,
            backgroundColor: COLORS.primary,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name="arrow-forward" size={22} color={COLORS.onPrimary} />
        </View>
        <View style={{ flex: 1 }}>
          <Typography
            variant="label"
            color={COLORS.outline}
            style={{ fontFamily: 'Manrope_600SemiBold', letterSpacing: 0.5 }}
          >
            NEXT TURN
          </Typography>
          <Typography
            variant="body"
            color={COLORS.onSurface}
            style={{ fontFamily: 'Manrope_700Bold', fontSize: 14, marginTop: 2 }}
            numberOfLines={1}
          >
            {nextTurn}
          </Typography>
        </View>
      </View>

      <View style={{ alignItems: 'flex-end', marginLeft: 8 }}>
        <Typography
          style={{
            fontFamily: 'SpaceGrotesk_700Bold',
            fontSize: 28,
            color: COLORS.primary,
            letterSpacing: -1,
            lineHeight: 30,
          }}
        >
          {timeToArrival}m
        </Typography>
        <Typography variant="label" color={COLORS.outline} style={{ marginTop: 2 }}>
          ETA {arrival}
        </Typography>
      </View>
    </View>
  );
}
