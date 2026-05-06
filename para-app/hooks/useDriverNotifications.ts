import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { supabase } from '@/lib/supabase';
import { useLocationStore } from '@/store/locationStore';
import { useDriverStore } from '@/store/driverStore';
import { useAuthStore } from '@/store/authStore';

// Foreground notification handler — show alert + sound when app is open
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

interface DemandSignalPayload {
  id: string;
  user_id: string | null;
  route_id: string | null;
}

export function useDriverNotifications() {
  const session = useAuthStore((s) => s.session);
  const profile = useAuthStore((s) => s.profile);
  const activeRouteId = useDriverStore((s) => s.activeRouteId);
  const coordsRef = useRef(useLocationStore.getState().coords);

  // Track latest coords without re-subscribing realtime channel
  useEffect(() => {
    return useLocationStore.subscribe((s) => {
      coordsRef.current = s.coords;
    });
  }, []);

  // Request notification permission once when driver picks a route
  useEffect(() => {
    if (!activeRouteId || profile?.role !== 'driver') return;

    (async () => {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        await Notifications.requestPermissionsAsync();
      }
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'PARA Demand Alerts',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#00236f',
        });
      }
    })();
  }, [activeRouteId, profile?.role]);

  // Subscribe to demand_signals INSERT events filtered by route
  useEffect(() => {
    if (!session || profile?.role !== 'driver' || !activeRouteId) return;

    const channel = supabase
      .channel(`driver-demand-${activeRouteId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'demand_signals',
          filter: `route_id=eq.${activeRouteId}`,
        },
        async (payload) => {
          const row = payload.new as Partial<DemandSignalPayload>;
          // Don't notify driver of their own pings
          if (row.user_id === session.user.id) return;

          // v1: notify on any new signal for the active route. Distance gating is a
          // follow-up — realtime ships geometry as WKB hex which needs a server-side
          // RPC echo to lat/lng before we can haversine here.
          await Notifications.scheduleNotificationAsync({
            content: {
              title: 'Commuter waiting',
              body: `Someone pressed PARA on Route ${activeRouteId}`,
              data: { signalId: row.id, routeId: activeRouteId },
              sound: 'default',
            },
            trigger: null,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session, profile?.role, activeRouteId]);
}
