import { View } from 'react-native';
import { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { Typography } from '@/components/ui/Typography';
import { COLORS } from '@/lib/constants';

interface JeepneyMarkerProps {
  id: string;
  latitude: number;
  longitude: number;
  routeId: string;
  seatsTotal: number;
  seatsFilled: number;
  heading?: number;
}

export function JeepneyMarker({
  id,
  latitude,
  longitude,
  routeId,
  seatsTotal,
  seatsFilled,
  heading,
}: JeepneyMarkerProps) {
  const seatsAvailable = seatsTotal - seatsFilled;
  const isFull = seatsAvailable === 0;

  return (
    <Marker
      key={id}
      coordinate={{ latitude, longitude }}
      anchor={{ x: 0.5, y: 1 }}
      tracksViewChanges={false}
    >
      <View style={{ alignItems: 'center' }}>
        {/* Seat availability badge */}
        <View
          style={{
            backgroundColor: isFull ? COLORS.error : COLORS.secondary,
            borderRadius: 999,
            paddingHorizontal: 6,
            paddingVertical: 2,
            marginBottom: 4,
          }}
        >
          <Typography
            style={{
              fontFamily: 'Manrope_700Bold',
              fontSize: 10,
              color: '#ffffff',
            }}
          >
            {isFull ? 'Full' : `${seatsAvailable} seats`}
          </Typography>
        </View>

        {/* Marker body */}
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: COLORS.primary,
            borderWidth: 2.5,
            borderColor: COLORS.surfaceContainerLowest,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: COLORS.primary,
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.4,
            shadowRadius: 6,
            elevation: 5,
          }}
        >
          <Ionicons name="bus" size={20} color={COLORS.onPrimary} />
        </View>

        {/* Route label */}
        <View
          style={{
            backgroundColor: COLORS.surfaceContainerLowest,
            borderRadius: 6,
            paddingHorizontal: 6,
            paddingVertical: 2,
            marginTop: 3,
            shadowColor: COLORS.primary,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
          }}
        >
          <Typography
            style={{
              fontFamily: 'SpaceGrotesk_700Bold',
              fontSize: 10,
              color: COLORS.primary,
            }}
          >
            {routeId}
          </Typography>
        </View>
      </View>
    </Marker>
  );
}
