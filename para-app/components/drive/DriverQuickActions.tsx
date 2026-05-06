import { View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Typography } from '@/components/ui/Typography';
import { COLORS } from '@/lib/constants';

interface DriverQuickActionsProps {
  onSOS?: () => void;
  onPause?: () => void;
}

export function DriverQuickActions({ onSOS, onPause }: DriverQuickActionsProps) {
  return (
    <View style={{ flexDirection: 'row', gap: 12 }}>
      {/* SOS — white card with red icon */}
      <Pressable
        onPress={onSOS}
        style={({ pressed }) => ({
          flex: 1,
          opacity: pressed ? 0.85 : 1,
        })}
      >
        <View
          pointerEvents="none"
          style={{
            width: '100%',
            backgroundColor: COLORS.surfaceContainerLowest,
            borderRadius: 20,
            paddingVertical: 18,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            gap: 10,
            shadowColor: COLORS.error,
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.12,
            shadowRadius: 14,
            elevation: 3,
          }}
        >
          <View
            style={{
              width: 26,
              height: 26,
              borderRadius: 8,
              backgroundColor: COLORS.error,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="warning" size={14} color="#ffffff" />
          </View>
          <Typography
            style={{
              fontFamily: 'Manrope_700Bold',
              fontSize: 14,
              color: COLORS.error,
              letterSpacing: 0.5,
            }}
          >
            SOS
          </Typography>
        </View>
      </Pressable>

      {/* Break — primary blue */}
      <Pressable
        onPress={onPause}
        style={({ pressed }) => ({
          flex: 1,
          opacity: pressed ? 0.85 : 1,
        })}
      >
        <View
          pointerEvents="none"
          style={{
            width: '100%',
            backgroundColor: COLORS.secondaryContainer,
            borderRadius: 20,
            paddingVertical: 18,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            gap: 10,
            shadowColor: COLORS.secondary,
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.25,
            shadowRadius: 14,
            elevation: 4,
          }}
        >
          <Ionicons name="pause" size={16} color={COLORS.onSecondary} />
          <Typography
            style={{
              fontFamily: 'Manrope_700Bold',
              fontSize: 14,
              color: COLORS.onSecondary,
              letterSpacing: 0.5,
            }}
          >
            BREAK
          </Typography>
        </View>
      </Pressable>
    </View>
  );
}
