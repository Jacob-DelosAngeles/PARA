import { View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Typography } from '@/components/ui/Typography';
import { COLORS } from '@/lib/constants';

interface SeatsAvailableCardProps {
  seatsAvailable: number;
  seatsTotal: number;
  onIncrement: () => void;
  onDecrement: () => void;
  disabled?: boolean;
}

export function SeatsAvailableCard({
  seatsAvailable,
  seatsTotal,
  onIncrement,
  onDecrement,
  disabled = false,
}: SeatsAvailableCardProps) {
  const canDecrement = seatsAvailable > 0 && !disabled;
  const canIncrement = seatsAvailable < seatsTotal && !disabled;

  return (
    <View
      style={{
        backgroundColor: COLORS.surfaceContainerLowest,
        borderRadius: 20,
        padding: 18,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.06,
        shadowRadius: 16,
        elevation: 3,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flex: 1 }}>
          <Typography
            variant="label"
            color={COLORS.outline}
            style={{ fontFamily: 'Manrope_600SemiBold', letterSpacing: 0.5 }}
          >
            SEATS AVAILABLE
          </Typography>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6, marginTop: 2 }}>
            <Typography
              style={{
                fontFamily: 'SpaceGrotesk_700Bold',
                fontSize: 48,
                color: COLORS.primary,
                letterSpacing: -2,
                lineHeight: 50,
              }}
            >
              {seatsAvailable}
            </Typography>
            <Typography variant="body" color={COLORS.outline}>
              of {seatsTotal}
            </Typography>
          </View>
        </View>

        <View style={{ flexDirection: 'row', gap: 10 }}>
          {/* Decrement (someone got on) */}
          <Pressable
            onPress={onDecrement}
            disabled={!canDecrement}
            style={({ pressed }) => ({
              width: 52,
              height: 52,
              borderRadius: 26,
              backgroundColor: canDecrement ? COLORS.surfaceContainerHigh : COLORS.surfaceContainer,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: pressed ? 0.7 : canDecrement ? 1 : 0.4,
            })}
          >
            <Ionicons name="remove" size={24} color={canDecrement ? COLORS.primary : COLORS.outline} />
          </Pressable>

          {/* Increment (someone got off) */}
          <Pressable
            onPress={onIncrement}
            disabled={!canIncrement}
            style={({ pressed }) => ({
              width: 52,
              height: 52,
              borderRadius: 26,
              backgroundColor: canIncrement ? COLORS.primary : COLORS.surfaceContainer,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: pressed ? 0.7 : canIncrement ? 1 : 0.4,
              shadowColor: COLORS.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: canIncrement ? 0.2 : 0,
              shadowRadius: 8,
              elevation: canIncrement ? 4 : 0,
            })}
          >
            <Ionicons name="add" size={24} color={canIncrement ? COLORS.onPrimary : COLORS.outline} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}
