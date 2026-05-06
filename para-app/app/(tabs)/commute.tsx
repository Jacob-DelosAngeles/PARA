import { View, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { MapCanvas } from '@/components/map/MapCanvas';
import { UserLocationDot } from '@/components/map/UserLocationDot';
import { JeepneyMarker } from '@/components/map/JeepneyMarker';
import { DestinationMarker } from '@/components/map/DestinationMarker';
import { ArrivalPlate } from '@/components/commute/ArrivalPlate';
import { FareCard } from '@/components/commute/FareCard';
import { RouteChecklist } from '@/components/commute/RouteChecklist';
import { Button } from '@/components/ui/Button';
import { Typography } from '@/components/ui/Typography';
import { COLORS, NEARBY_ROUTES } from '@/lib/constants';
import { useLocation } from '@/hooks/useLocation';
import { useNearbyVehicles } from '@/hooks/useNearbyVehicles';
import { useDestinationStore } from '@/store/destinationStore';
import { usePara } from '@/hooks/usePara';

export default function CommuteScreen() {
  const coords = useLocation();
  const insets = useSafeAreaInsets();
  const destination = useDestinationStore((s) => s.destination);
  const setDestination = useDestinationStore((s) => s.setDestination);
  const clearDestination = useDestinationStore((s) => s.clearDestination);

  const liveVehicles = useNearbyVehicles();
  const { submit, submitting, arrival, cooldownMs, cooldownRemainingMs } = usePara();

  // Vehicles to render: prefer live, fall back to mock for empty DB during dev
  const vehicles =
    liveVehicles.length > 0
      ? liveVehicles.map((v) => ({
          id: v.id,
          routeId: v.route_id ?? '?',
          lat: v.lat ?? 0,
          lng: v.lng ?? 0,
          seatsTotal: v.seats_total,
          seatsFilled: v.seats_filled,
        }))
      : [];

  const hasArrival = !!arrival;
  const heroMinutes = arrival?.eta_min ?? 0;
  const heroSeats = arrival ? arrival.seats_total - arrival.seats_filled : 0;
  const heroRouteId = arrival?.route_id ?? NEARBY_ROUTES[0]?.id ?? 'LB-CAL';
  const heroRouteName =
    arrival?.route_id ? `Route ${arrival.route_id}` : 'Route ' + heroRouteId;

  function handleLongPress(c: { latitude: number; longitude: number }) {
    setDestination({ latitude: c.latitude, longitude: c.longitude });
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.surface }}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 12,
          paddingBottom: insets.bottom + 96,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Top app bar */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            paddingBottom: 14,
          }}
        >
          <Typography
            style={{
              fontFamily: 'SpaceGrotesk_700Bold',
              fontSize: 24,
              color: COLORS.primary,
              letterSpacing: -0.5,
            }}
          >
            PARA
          </Typography>
          <Pressable
            style={({ pressed }) => ({
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: COLORS.surfaceContainerLowest,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <Ionicons name="notifications-outline" size={20} color={COLORS.primary} />
          </Pressable>
        </View>

        {/* Map (300px tall, up top) — long-press to set destination */}
        <View
          style={{
            marginHorizontal: 16,
            height: 300,
            borderRadius: 24,
            overflow: 'hidden',
            backgroundColor: COLORS.surfaceContainer,
            marginBottom: 14,
          }}
        >
          <MapCanvas onLongPressLocation={handleLongPress}>
            {coords && <UserLocationDot coords={coords} />}
            {destination && (
              <DestinationMarker coords={destination} onDragEnd={handleLongPress} />
            )}
            {vehicles.map((v) => (
              <JeepneyMarker
                key={v.id}
                id={v.id}
                latitude={v.lat}
                longitude={v.lng}
                routeId={v.routeId}
                seatsTotal={v.seatsTotal}
                seatsFilled={v.seatsFilled}
              />
            ))}
          </MapCanvas>

          {/* Map hint overlay */}
          {!destination && (
            <View
              pointerEvents="none"
              style={{
                position: 'absolute',
                top: 12,
                left: 12,
                right: 12,
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 999,
                backgroundColor: 'rgba(247,249,251,0.95)',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
                alignSelf: 'flex-start',
              }}
            >
              <Ionicons name="information-circle" size={14} color={COLORS.primary} />
              <Typography
                color={COLORS.primary}
                style={{ fontFamily: 'Manrope_700Bold', fontSize: 11 }}
              >
                Long-press the map to drop your destination pin
              </Typography>
            </View>
          )}

          {destination && (
            <Pressable
              onPress={clearDestination}
              style={({ pressed }) => ({
                position: 'absolute',
                top: 12,
                right: 12,
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 999,
                backgroundColor: 'rgba(247,249,251,0.95)',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <Ionicons name="close" size={14} color={COLORS.error} />
              <Typography
                color={COLORS.error}
                style={{ fontFamily: 'Manrope_700Bold', fontSize: 11 }}
              >
                Clear pin
              </Typography>
            </Pressable>
          )}
        </View>

        {/* Route multi-checklist */}
        <View style={{ paddingHorizontal: 16, marginBottom: 12 }}>
          <RouteChecklist />
        </View>

        {/* Fare card — only when destination is set */}
        {coords && destination && (
          <View style={{ paddingHorizontal: 16, marginBottom: 12 }}>
            <FareCard origin={coords} destination={destination} />
          </View>
        )}

        {/* ArrivalPlate hero — populated after PARA press */}
        {hasArrival ? (
          <View style={{ paddingHorizontal: 16, marginBottom: 12 }}>
            <ArrivalPlate
              minutesAway={heroMinutes}
              routeId={heroRouteId}
              routeName={heroRouteName}
            />
            <Typography
              variant="label"
              color={COLORS.outline}
              style={{ marginTop: 6, textAlign: 'center', fontFamily: 'Manrope_500Medium' }}
            >
              {heroSeats} seats available · {(arrival!.dist_m / 1000).toFixed(1)} km away
            </Typography>
          </View>
        ) : (
          <View style={{ paddingHorizontal: 16, marginBottom: 12 }}>
            <View
              style={{
                backgroundColor: COLORS.surfaceContainerLowest,
                borderRadius: 24,
                padding: 22,
                alignItems: 'center',
                gap: 8,
                shadowColor: COLORS.primary,
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.05,
                shadowRadius: 16,
                elevation: 2,
              }}
            >
              <Ionicons name="bus-outline" size={28} color={COLORS.primary} />
              <Typography
                style={{
                  fontFamily: 'SpaceGrotesk_700Bold',
                  fontSize: 16,
                  color: COLORS.onSurface,
                  textAlign: 'center',
                }}
              >
                Press PARA to broadcast your demand
              </Typography>
              <Typography variant="body" color={COLORS.outline} style={{ fontSize: 12, textAlign: 'center' }}>
                Drivers on your selected routes will be notified, and the next jeepney's ETA will appear here.
              </Typography>
            </View>
          </View>
        )}

        {/* PARA primary CTA — pressable even when not ready, so user gets feedback */}
        <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
          <Button
            label={submitting ? 'Sending…' : 'PARA'}
            variant="primary"
            size="lg"
            fullWidth
            disabled={submitting}
            cooldownMs={cooldownMs}
            cooldownRemainingMs={cooldownRemainingMs}
            trailingIcon={<Ionicons name="arrow-forward" size={18} color={COLORS.onPrimary} />}
            onPress={submit}
          />
        </View>
      </ScrollView>
    </View>
  );
}
