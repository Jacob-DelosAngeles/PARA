import { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import { Marker } from 'react-native-maps';
import { COLORS } from '@/lib/constants';
import type { Coords } from '@/types';

interface UserLocationDotProps {
  coords: Coords;
}

export function UserLocationDot({ coords }: UserLocationDotProps) {
  const pulse = useRef(new Animated.Value(1)).current;
  const fadeOut = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(pulse, { toValue: 2.2, duration: 1200, useNativeDriver: true }),
          Animated.timing(pulse, { toValue: 1, duration: 0, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(fadeOut, { toValue: 0, duration: 1200, useNativeDriver: true }),
          Animated.timing(fadeOut, { toValue: 0.6, duration: 0, useNativeDriver: true }),
        ]),
      ])
    ).start();
  }, []);

  return (
    <Marker
      coordinate={{ latitude: coords.latitude, longitude: coords.longitude }}
      anchor={{ x: 0.5, y: 0.5 }}
      tracksViewChanges={false}
    >
      <View style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}>
        {/* Accuracy ring */}
        <Animated.View
          style={{
            position: 'absolute',
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: `${COLORS.secondary}20`,
            transform: [{ scale: pulse }],
            opacity: fadeOut,
          }}
        />
        {/* Main dot */}
        <View
          style={{
            width: 14,
            height: 14,
            borderRadius: 7,
            backgroundColor: COLORS.secondary,
            borderWidth: 2.5,
            borderColor: COLORS.surfaceContainerLowest,
            shadowColor: COLORS.primary,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 4,
          }}
        />
      </View>
    </Marker>
  );
}
