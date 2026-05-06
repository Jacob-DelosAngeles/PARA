import { View } from 'react-native';
import { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { Typography } from '@/components/ui/Typography';
import { COLORS } from '@/lib/constants';

interface DropoffMarkerProps {
  id: string;
  lat: number;
  lng: number;
  farePhp?: number | null;
}

export function DropoffMarker({ id, lat, lng, farePhp }: DropoffMarkerProps) {
  return (
    <Marker
      key={id}
      coordinate={{ latitude: lat, longitude: lng }}
      anchor={{ x: 0.5, y: 1 }}
      tracksViewChanges={false}
    >
      <View style={{ alignItems: 'center' }}>
        {farePhp != null && (
          <View
            style={{
              backgroundColor: '#ffffff',
              paddingHorizontal: 8,
              paddingVertical: 3,
              borderRadius: 999,
              marginBottom: 4,
              shadowColor: COLORS.primary,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.15,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <Typography
              style={{
                fontFamily: 'SpaceGrotesk_700Bold',
                fontSize: 11,
                color: COLORS.primary,
              }}
            >
              ₱{farePhp}
            </Typography>
          </View>
        )}
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: '#f59e0b',
            borderWidth: 2.5,
            borderColor: '#ffffff',
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#f59e0b',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.4,
            shadowRadius: 8,
            elevation: 5,
          }}
        >
          <Ionicons name="flag" size={16} color="#ffffff" />
        </View>
        <View
          style={{
            width: 3,
            height: 8,
            backgroundColor: '#f59e0b',
            marginTop: -2,
          }}
        />
      </View>
    </Marker>
  );
}
