import { useEffect } from 'react';
import * as Location from 'expo-location';
import { useLocationStore } from '@/store/locationStore';

export function useLocation() {
  const setLocation = useLocationStore((s) => s.setLocation);

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 2000,
          distanceInterval: 5,
        },
        (loc) => {
          setLocation({
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
            heading: loc.coords.heading ?? undefined,
            accuracy: loc.coords.accuracy ?? undefined,
          });
        }
      );
    })();

    return () => {
      subscription?.remove();
    };
  }, []);

  return useLocationStore((s) => s.coords);
}
