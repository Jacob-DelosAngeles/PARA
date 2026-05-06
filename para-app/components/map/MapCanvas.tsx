import { StyleSheet, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE, MapType, MapViewProps, MapPressEvent } from 'react-native-maps';
import { DEFAULT_REGION } from '@/lib/constants';
import { useLocationStore } from '@/store/locationStore';

// Applied only on 'standard' mode — ignored by hybrid/satellite (intentional)
const PARA_MAP_STYLE = [
  { elementType: 'geometry', stylers: [{ color: '#f7f9fb' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#444651' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#f7f9fb' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#adc6ff' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#0058be' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#dce1ff' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
  { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#b6c4ff' }] },
  { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'simplified' }] },
  { featureType: 'administrative', elementType: 'labels', stylers: [{ visibility: 'simplified' }] },
];

interface MapCanvasProps extends Omit<MapViewProps, 'style'> {
  children?: React.ReactNode;
  mapType?: MapType;
  onLongPressLocation?: (coords: { latitude: number; longitude: number }) => void;
}

export function MapCanvas({
  children,
  mapType = 'standard',
  onLongPressLocation,
  onLongPress,
  ...props
}: MapCanvasProps) {
  const coords = useLocationStore((s) => s.coords);

  const initialRegion = coords
    ? {
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.015,
      }
    : DEFAULT_REGION;

  function handleLongPress(e: MapPressEvent) {
    if (onLongPressLocation) {
      onLongPressLocation(e.nativeEvent.coordinate);
    }
    onLongPress?.(e);
  }

  return (
    <View style={StyleSheet.absoluteFill}>
      <MapView
        style={StyleSheet.absoluteFill}
        provider={PROVIDER_GOOGLE}
        mapType={mapType}
        customMapStyle={mapType === 'standard' ? PARA_MAP_STYLE : undefined}
        initialRegion={initialRegion}
        showsUserLocation={false}
        showsMyLocationButton={false}
        showsCompass={false}
        showsScale={false}
        rotateEnabled={false}
        onLongPress={handleLongPress}
        {...props}
      >
        {children}
      </MapView>
    </View>
  );
}
