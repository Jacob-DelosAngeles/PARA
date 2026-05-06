import { View } from 'react-native';
import { NearbyRouteCard } from './NearbyRouteCard';
import { Typography } from '@/components/ui/Typography';
import { COLORS } from '@/lib/constants';
import type { RouteInfo } from '@/types';

interface NearbyRoutesListProps {
  routes: RouteInfo[];
}

export function NearbyRoutesList({ routes }: NearbyRoutesListProps) {
  return (
    <View>
      <Typography
        variant="title"
        color={COLORS.onSurface}
        style={{ marginBottom: 12, fontFamily: 'SpaceGrotesk_700Bold', fontSize: 16 }}
      >
        Nearby Routes
      </Typography>
      <View style={{ gap: 8 }}>
        {routes.map((route) => (
          <NearbyRouteCard key={route.id} route={route} />
        ))}
      </View>
    </View>
  );
}
