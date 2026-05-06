import { StyleSheet, View } from 'react-native';
import { Typography } from '@/components/ui/Typography';
import { COLORS } from '@/lib/constants';

interface MapCanvasProps {
  children?: React.ReactNode;
  mapType?: string;
}

export function MapCanvas({ children }: MapCanvasProps) {
  return (
    <View style={[StyleSheet.absoluteFill, styles.container]}>
      <Typography variant="label" color={COLORS.outline}>
        Map preview is iOS / Android only
      </Typography>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
