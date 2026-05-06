import { useEffect, useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';
import { useLocationStore } from '@/store/locationStore';
import { useDestinationStore } from '@/store/destinationStore';
import { useCommuterStore, getRemainingCooldownMs, PARA_COOLDOWN_MS } from '@/store/commuterStore';
import { haversineKm, farePhp } from '@/lib/geo';

export interface NearestArrival {
  vehicle_id: string;
  driver_id: string;
  route_id: string | null;
  lat: number;
  lng: number;
  seats_total: number;
  seats_filled: number;
  dist_m: number;
  eta_min: number;
}

export function usePara() {
  const session = useAuthStore((s) => s.session);
  const isGuest = useAuthStore((s) => s.isGuest);
  const coords = useLocationStore((s) => s.coords);
  const destination = useDestinationStore((s) => s.destination);
  const selectedRouteIds = useDestinationStore((s) => s.selectedRouteIds);
  const cooldownStartedAt = useCommuterStore((s) => s.cooldownStartedAt);
  const setCooldown = useCommuterStore((s) => s.setCooldown);

  const [submitting, setSubmitting] = useState(false);
  const [arrival, setArrival] = useState<NearestArrival | null>(null);
  const [remainingMs, setRemainingMs] = useState(getRemainingCooldownMs(cooldownStartedAt));

  useEffect(() => {
    if (!cooldownStartedAt) {
      setRemainingMs(0);
      return;
    }
    const tick = () => setRemainingMs(getRemainingCooldownMs(cooldownStartedAt));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [cooldownStartedAt]);

  const submit = useCallback(async () => {
    // Validate in priority order — show specific feedback so user knows why
    if (isGuest || !session) {
      Alert.alert(
        'Sign in required',
        'Create an account or sign in to broadcast PARA requests to drivers.'
      );
      return;
    }
    if (!coords) {
      Alert.alert('No location', 'Waiting for GPS — please try again in a moment.');
      return;
    }
    if (selectedRouteIds.length === 0) {
      Alert.alert(
        'Pick a route',
        'Tick one or more routes that pass by your destination, then press PARA again.'
      );
      return;
    }
    if (!destination) {
      Alert.alert(
        'Set destination',
        'Long-press on the map to drop a destination pin so drivers know where you want to alight.'
      );
      return;
    }
    if (remainingMs > 0) {
      const totalSec = Math.ceil(remainingMs / 1000);
      const m = Math.floor(totalSec / 60);
      const s = totalSec % 60;
      Alert.alert(
        'Cooldown active',
        `Wait ${m}:${s.toString().padStart(2, '0')} before pressing PARA again. ` +
          `This keeps demand updates fresh for drivers.`
      );
      return;
    }

    setSubmitting(true);
    try {
      const distanceKm = haversineKm(coords, destination);
      const fare = farePhp(distanceKm);

      const { error: insertError } = await supabase.from('demand_signals').insert({
        user_id: session.user.id,
        location: `POINT(${coords.longitude} ${coords.latitude})`,
        destination: `POINT(${destination.longitude} ${destination.latitude})`,
        route_id: selectedRouteIds[0], // primary route
        routes: selectedRouteIds, // all compatible routes
        fare_php: fare,
      });

      if (insertError) {
        if (insertError.message?.toLowerCase().includes('cooldown')) {
          Alert.alert(
            'Cooldown active',
            'You can only press PARA once every 3 minutes. This keeps demand updates fresh for drivers.'
          );
        } else {
          Alert.alert('Could not send', insertError.message);
        }
        return;
      }

      setCooldown(Date.now());

      const { data: arrivals } = await supabase.rpc('nearest_arrival', {
        origin: `POINT(${coords.longitude} ${coords.latitude})`,
        destination: `POINT(${destination.longitude} ${destination.latitude})`,
      });
      if (arrivals && arrivals.length > 0) {
        setArrival(arrivals[0] as NearestArrival);
      }
    } catch (err) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  }, [coords, destination, selectedRouteIds, isGuest, session, remainingMs, setCooldown]);

  return {
    submit,
    submitting,
    arrival,
    cooldownMs: PARA_COOLDOWN_MS,
    cooldownRemainingMs: remainingMs,
    canSubmit:
      !!coords && !!destination && selectedRouteIds.length > 0 && !isGuest && !!session && remainingMs === 0,
  };
}
