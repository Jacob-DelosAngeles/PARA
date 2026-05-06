import { View } from 'react-native';
import { Marker, MarkerDragStartEndEvent } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/lib/constants';
import type { Coords } from '@/types';

interface DestinationMarkerProps {
  coords: Coords;
  onDragEnd?: (next: { latitude: number; longitude: number }) => void;
}

export function DestinationMarker({ coords, onDragEnd }: DestinationMarkerProps) {
  function handleDragEnd(e: MarkerDragStartEndEvent) {
    onDragEnd?.(e.nativeEvent.coordinate);
  }

  return (
    <Marker
      coordinate={{ latitude: coords.latitude, longitude: coords.longitude }}
      anchor={{ x: 0.5, y: 1 }}
      draggable
      onDragEnd={handleDragEnd}
      tracksViewChanges={false}
    >
      <View style={{ alignItems: 'center' }}>
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: COLORS.primary,
            borderWidth: 3,
            borderColor: COLORS.surfaceContainerLowest,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: COLORS.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.4,
            shadowRadius: 8,
            elevation: 6,
          }}
        >
          <Ionicons name="flag" size={20} color={COLORS.onPrimary} />
        </View>
        <View
          style={{
            width: 4,
            height: 10,
            backgroundColor: COLORS.primary,
            marginTop: -2,
          }}
        />
      </View>
    </Marker>
  );
}
