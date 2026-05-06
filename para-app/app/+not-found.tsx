import { View } from 'react-native';
import { Link } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { COLORS } from '@/lib/constants';

export default function NotFoundScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.surface, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <Typography variant="headline" color={COLORS.onSurface}>
        Screen not found
      </Typography>
      <Link href="/(tabs)/commute" style={{ marginTop: 16 }}>
        <Typography variant="body" color={COLORS.primary}>
          Go to Commute
        </Typography>
      </Link>
    </View>
  );
}
