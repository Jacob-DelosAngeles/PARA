import { useState } from 'react';
import { View, Pressable, Modal, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Typography } from '@/components/ui/Typography';
import { COLORS } from '@/lib/constants';
import { useRoutes } from '@/hooks/useRoutes';
import { useDriverStore } from '@/store/driverStore';

interface RoutePickerTriggerProps {
  onPress: () => void;
}

export function RoutePickerTrigger({ onPress }: RoutePickerTriggerProps) {
  const activeRouteId = useDriverStore((s) => s.activeRouteId);
  const { data: routes } = useRoutes();
  const active = routes?.find((r) => r.id === activeRouteId);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 999,
        backgroundColor: active ? COLORS.primary : COLORS.surfaceContainerHigh,
        opacity: pressed ? 0.85 : 1,
      })}
    >
      <Ionicons
        name="git-branch"
        size={14}
        color={active ? COLORS.onPrimary : COLORS.primary}
      />
      <Typography
        color={active ? COLORS.onPrimary : COLORS.primary}
        style={{ fontFamily: 'Manrope_700Bold', fontSize: 12, letterSpacing: 0.3 }}
      >
        {active ? `Route ${active.id}` : 'Select Route'}
      </Typography>
      <Ionicons
        name="chevron-down"
        size={14}
        color={active ? COLORS.onPrimary : COLORS.primary}
      />
    </Pressable>
  );
}

interface RoutePickerSheetProps {
  visible: boolean;
  onClose: () => void;
}

export function RoutePickerSheet({ visible, onClose }: RoutePickerSheetProps) {
  const insets = useSafeAreaInsets();
  const { data: routes, isLoading } = useRoutes();
  const activeRouteId = useDriverStore((s) => s.activeRouteId);
  const setActiveRouteId = useDriverStore((s) => s.setActiveRouteId);

  function handlePick(id: string) {
    setActiveRouteId(id);
    onClose();
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      {/* Backdrop */}
      <Pressable
        onPress={onClose}
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.35)' }}
      />

      {/* Sheet */}
      <View
        style={{
          backgroundColor: COLORS.surface,
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          paddingTop: 12,
          paddingHorizontal: 20,
          paddingBottom: insets.bottom + 24,
          maxHeight: '70%',
        }}
      >
        {/* Drag handle */}
        <View
          style={{
            alignSelf: 'center',
            width: 40,
            height: 4,
            borderRadius: 2,
            backgroundColor: COLORS.outlineVariant,
            marginBottom: 16,
          }}
        />

        <View style={{ marginBottom: 16 }}>
          <Typography
            style={{
              fontFamily: 'SpaceGrotesk_700Bold',
              fontSize: 22,
              color: COLORS.onSurface,
              letterSpacing: -0.5,
            }}
          >
            Select your route
          </Typography>
          <Typography variant="body" color={COLORS.outline} style={{ marginTop: 4 }}>
            Demand and seat updates broadcast to commuters on this route.
          </Typography>
        </View>

        {isLoading ? (
          <Typography variant="body" color={COLORS.outline} style={{ paddingVertical: 24, textAlign: 'center' }}>
            Loading routes…
          </Typography>
        ) : (
          <FlatList
            data={routes ?? []}
            keyExtractor={(r) => r.id}
            ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
            renderItem={({ item }) => {
              const active = item.id === activeRouteId;
              return (
                <Pressable
                  onPress={() => handlePick(item.id)}
                  style={({ pressed }) => ({
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 14,
                    padding: 16,
                    borderRadius: 16,
                    backgroundColor: active ? `${COLORS.primary}10` : COLORS.surfaceContainerLowest,
                    borderWidth: active ? 2 : 0,
                    borderColor: active ? COLORS.primary : 'transparent',
                    opacity: pressed ? 0.85 : 1,
                  })}
                >
                  <View
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 14,
                      backgroundColor: item.color_hex ?? COLORS.primary,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography
                      style={{
                        fontFamily: 'SpaceGrotesk_700Bold',
                        fontSize: 13,
                        color: '#ffffff',
                      }}
                    >
                      {item.id}
                    </Typography>
                  </View>
                  <Typography
                    style={{
                      flex: 1,
                      fontFamily: 'Manrope_700Bold',
                      fontSize: 15,
                      color: COLORS.onSurface,
                    }}
                  >
                    {item.display_name}
                  </Typography>
                  {active && <Ionicons name="checkmark-circle" size={22} color={COLORS.primary} />}
                </Pressable>
              );
            }}
          />
        )}
      </View>
    </Modal>
  );
}
