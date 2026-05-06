import { View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Typography } from '@/components/ui/Typography';
import { COLORS } from '@/lib/constants';
import { useRoutes } from '@/hooks/useRoutes';
import { useDestinationStore } from '@/store/destinationStore';

export function RouteChecklist() {
  const { data: routes, isLoading } = useRoutes();
  const selected = useDestinationStore((s) => s.selectedRouteIds);
  const toggle = useDestinationStore((s) => s.toggleRoute);

  return (
    <View
      style={{
        backgroundColor: COLORS.surfaceContainerLowest,
        borderRadius: 20,
        padding: 16,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.06,
        shadowRadius: 16,
        elevation: 3,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <Ionicons name="git-branch" size={16} color={COLORS.primary} />
        <Typography
          variant="label"
          color={COLORS.outline}
          style={{ fontFamily: 'Manrope_700Bold', letterSpacing: 0.5, flex: 1 }}
        >
          PICK ANY ROUTE THAT WORKS
        </Typography>
        {selected.length > 0 && (
          <View
            style={{
              backgroundColor: COLORS.primary,
              borderRadius: 999,
              paddingHorizontal: 8,
              paddingVertical: 2,
            }}
          >
            <Typography
              style={{
                fontFamily: 'Manrope_700Bold',
                fontSize: 10,
                color: COLORS.onPrimary,
              }}
            >
              {selected.length}
            </Typography>
          </View>
        )}
      </View>

      {isLoading && (
        <Typography variant="body" color={COLORS.outline} style={{ paddingVertical: 8 }}>
          Loading routes…
        </Typography>
      )}

      <View style={{ gap: 8 }}>
        {(routes ?? []).map((r) => {
          const checked = selected.includes(r.id);
          return (
            <Pressable
              key={r.id}
              onPress={() => toggle(r.id)}
              style={({ pressed }) => ({
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                paddingVertical: 10,
                paddingHorizontal: 12,
                borderRadius: 14,
                backgroundColor: checked ? `${COLORS.primary}10` : COLORS.surfaceContainerLow,
                opacity: pressed ? 0.8 : 1,
              })}
            >
              {/* Checkbox */}
              <View
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 6,
                  borderWidth: 2,
                  borderColor: checked ? COLORS.primary : COLORS.outlineVariant,
                  backgroundColor: checked ? COLORS.primary : 'transparent',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {checked && <Ionicons name="checkmark" size={14} color={COLORS.onPrimary} />}
              </View>

              {/* Route id chip */}
              <View
                style={{
                  paddingHorizontal: 8,
                  paddingVertical: 3,
                  borderRadius: 8,
                  backgroundColor: r.color_hex ?? COLORS.primary,
                }}
              >
                <Typography
                  style={{
                    fontFamily: 'SpaceGrotesk_700Bold',
                    fontSize: 11,
                    color: '#ffffff',
                  }}
                >
                  {r.id}
                </Typography>
              </View>

              <Typography
                style={{
                  flex: 1,
                  fontFamily: 'Manrope_600SemiBold',
                  fontSize: 13,
                  color: COLORS.onSurface,
                }}
                numberOfLines={1}
              >
                {r.display_name}
              </Typography>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
