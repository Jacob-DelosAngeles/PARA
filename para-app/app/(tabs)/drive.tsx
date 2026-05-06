import { useState } from 'react';
import { View, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { MapCanvas } from '@/components/map/MapCanvas';
import { UserLocationDot } from '@/components/map/UserLocationDot';
import { DemandHeatmap } from '@/components/map/DemandHeatmap';
import { DropoffMarker } from '@/components/map/DropoffMarker';
import { NavigationContextCard } from '@/components/drive/NavigationContextCard';
import { DemandAheadCard } from '@/components/drive/DemandAheadCard';
import { SeatsAvailableCard } from '@/components/drive/SeatsAvailableCard';
import { DriverQuickActions } from '@/components/drive/DriverQuickActions';
import { RoutePickerTrigger, RoutePickerSheet } from '@/components/drive/RoutePicker';
import { Typography } from '@/components/ui/Typography';
import { COLORS, DRIVER_STATS } from '@/lib/constants';
import { useLocation } from '@/hooks/useLocation';
import { useDriverStore } from '@/store/driverStore';
import { useDriverVehicle } from '@/hooks/useDriverVehicle';
import { useRouteDemandHeatmap } from '@/hooks/useDemandSignals';
import { useRouteDropoffs } from '@/hooks/useRouteDropoffs';
import { useDriverNotifications } from '@/hooks/useDriverNotifications';

export default function DriveScreen() {
  const coords = useLocation();
  const insets = useSafeAreaInsets();
  const [pickerOpen, setPickerOpen] = useState(false);
  const activeRouteId = useDriverStore((s) => s.activeRouteId);
  const heatmapPoints = useRouteDemandHeatmap(activeRouteId);
  const dropoffs = useRouteDropoffs(activeRouteId);
  const { seatsAvailable, seatsTotal, increment, decrement, vehicle } = useDriverVehicle();
  useDriverNotifications();

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.surface }}>
      {/* Standard map with PARA tonal style */}
      <MapCanvas mapType="standard">
        {coords && <UserLocationDot coords={coords} />}
        {activeRouteId && <DemandHeatmap points={heatmapPoints} />}
        {activeRouteId &&
          dropoffs.map((d) => (
            <DropoffMarker
              key={d.signal_id}
              id={d.signal_id}
              lat={d.lat}
              lng={d.lng}
              farePhp={d.fare_php}
            />
          ))}
      </MapCanvas>

      {/* Top app bar — PARA wordmark + RoutePicker */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          paddingTop: insets.top + 8,
          paddingHorizontal: 16,
          paddingBottom: 10,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'rgba(247, 249, 251, 0.92)',
        }}
      >
        <Typography
          style={{
            fontFamily: 'SpaceGrotesk_700Bold',
            fontSize: 22,
            color: COLORS.primary,
            letterSpacing: -0.5,
          }}
        >
          PARA
        </Typography>
        <RoutePickerTrigger onPress={() => setPickerOpen(true)} />
      </View>

      {/* Route empty state — replaces all middle content when no route */}
      {!activeRouteId ? (
        <View
          style={{
            position: 'absolute',
            top: insets.top + 80,
            left: 16,
            right: 16,
          }}
        >
          <View
            style={{
              backgroundColor: COLORS.surfaceContainerLowest,
              borderRadius: 24,
              padding: 24,
              alignItems: 'center',
              gap: 12,
              shadowColor: COLORS.primary,
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.06,
              shadowRadius: 20,
              elevation: 4,
            }}
          >
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 18,
                backgroundColor: `${COLORS.primary}10`,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="git-branch" size={28} color={COLORS.primary} />
            </View>
            <Typography
              style={{
                fontFamily: 'SpaceGrotesk_700Bold',
                fontSize: 18,
                color: COLORS.onSurface,
                textAlign: 'center',
              }}
            >
              Pick your route to start
            </Typography>
            <Typography variant="body" color={COLORS.outline} style={{ textAlign: 'center', lineHeight: 20 }}>
              Once you select your route, you'll see live commuter demand along your path and broadcast seat availability.
            </Typography>
            <Pressable
              onPress={() => setPickerOpen(true)}
              style={({ pressed }) => ({
                marginTop: 8,
                paddingHorizontal: 20,
                paddingVertical: 12,
                borderRadius: 14,
                backgroundColor: COLORS.primary,
                opacity: pressed ? 0.85 : 1,
              })}
            >
              <Typography
                style={{
                  fontFamily: 'Manrope_700Bold',
                  fontSize: 14,
                  color: COLORS.onPrimary,
                  letterSpacing: 0.3,
                }}
              >
                Choose Route
              </Typography>
            </Pressable>
          </View>
        </View>
      ) : (
        <>
          {/* Navigation context card */}
          <View
            style={{
              position: 'absolute',
              top: insets.top + 64,
              left: 16,
              right: 16,
            }}
          >
            <NavigationContextCard
              nextTurn={DRIVER_STATS.nextTurn}
              arrival={DRIVER_STATS.arrival}
              timeToArrival={DRIVER_STATS.timeToArrival}
            />
          </View>

          {/* Bottom stack */}
          <View
            style={{
              position: 'absolute',
              bottom: insets.bottom + 72,
              left: 16,
              right: 16,
              gap: 10,
            }}
          >
            <SeatsAvailableCard
              seatsAvailable={seatsAvailable}
              seatsTotal={seatsTotal}
              onIncrement={increment}
              onDecrement={decrement}
              disabled={!vehicle}
            />
            <DemandAheadCard
              demandAlert={
                heatmapPoints.length > 0
                  ? `${heatmapPoints.length} commuter${heatmapPoints.length === 1 ? '' : 's'} waiting on Route ${activeRouteId}`
                  : `No demand on Route ${activeRouteId} right now`
              }
              demandSub={
                heatmapPoints.length > 0
                  ? `${dropoffs.length} drop-off${dropoffs.length === 1 ? '' : 's'} marked on the map.`
                  : `You'll be notified when commuters press PARA nearby.`
              }
            />
            <DriverQuickActions />
          </View>
        </>
      )}

      <RoutePickerSheet visible={pickerOpen} onClose={() => setPickerOpen(false)} />
    </View>
  );
}
