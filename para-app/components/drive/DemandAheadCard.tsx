import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Typography } from '@/components/ui/Typography';
import { COLORS } from '@/lib/constants';

interface DemandAheadCardProps {
  demandAlert: string;
  demandSub: string;
}

export function DemandAheadCard({ demandAlert, demandSub }: DemandAheadCardProps) {
  return (
    <View
      style={{
        backgroundColor: COLORS.primary,
        borderRadius: 20,
        padding: 18,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 8,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <View style={{ flex: 1 }}>
          <Typography
            style={{
              fontFamily: 'SpaceGrotesk_700Bold',
              fontSize: 17,
              color: '#ffffff',
              lineHeight: 22,
            }}
          >
            {demandAlert}
          </Typography>
          <Typography
            style={{
              fontFamily: 'Manrope_400Regular',
              fontSize: 12,
              color: 'rgba(255,255,255,0.7)',
              marginTop: 6,
              lineHeight: 17,
            }}
          >
            {demandSub}
          </Typography>
        </View>

        <View
          style={{
            backgroundColor: 'rgba(255,255,255,0.18)',
            borderRadius: 999,
            paddingHorizontal: 10,
            paddingVertical: 5,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <Ionicons name="flame" size={11} color="#ffffff" />
          <Typography
            style={{
              fontFamily: 'Manrope_700Bold',
              fontSize: 10,
              color: '#ffffff',
              letterSpacing: 0.5,
            }}
          >
            HIGH DEMAND
          </Typography>
        </View>
      </View>
    </View>
  );
}
