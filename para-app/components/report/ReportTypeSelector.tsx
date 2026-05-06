import { View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Typography } from '@/components/ui/Typography';
import { COLORS } from '@/lib/constants';

type ReportType = 'accident' | 'pothole' | 'traffic';

const TYPES: {
  key: ReportType;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}[] = [
  { key: 'accident', label: 'Accident', icon: 'warning', color: COLORS.error },
  { key: 'pothole', label: 'Pothole', icon: 'alert-circle', color: '#b45309' },
  { key: 'traffic', label: 'Traffic', icon: 'car-sport', color: COLORS.secondary },
];

interface ReportTypeSelectorProps {
  selected: ReportType | null;
  onSelect: (type: ReportType) => void;
}

export function ReportTypeSelector({ selected, onSelect }: ReportTypeSelectorProps) {
  return (
    <View style={{ flexDirection: 'row', gap: 10 }}>
      {TYPES.map((t) => {
        const isSelected = selected === t.key;
        return (
          <Pressable
            key={t.key}
            onPress={() => onSelect(t.key)}
            style={({ pressed }) => ({
              flex: 1,
              opacity: pressed ? 0.85 : 1,
            })}
          >
            <View
              pointerEvents="none"
              style={{
                width: '100%',
                paddingVertical: 16,
                paddingHorizontal: 8,
                borderRadius: 16,
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                backgroundColor: isSelected ? t.color : COLORS.surfaceContainerLowest,
                shadowColor: isSelected ? t.color : COLORS.primary,
                shadowOffset: { width: 0, height: isSelected ? 6 : 2 },
                shadowOpacity: isSelected ? 0.25 : 0.04,
                shadowRadius: isSelected ? 14 : 6,
                elevation: isSelected ? 4 : 1,
              }}
            >
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 12,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : `${t.color}15`,
                }}
              >
                <Ionicons name={t.icon} size={20} color={isSelected ? '#ffffff' : t.color} />
              </View>
              <Typography
                variant="label"
                color={isSelected ? '#ffffff' : COLORS.onSurfaceVariant}
                style={{ fontFamily: 'Manrope_700Bold', fontSize: 12 }}
              >
                {t.label}
              </Typography>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}
