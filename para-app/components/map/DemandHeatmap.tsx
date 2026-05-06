import { Heatmap } from 'react-native-maps';

export interface HeatmapPoint {
  latitude: number;
  longitude: number;
  weight: number;
}

interface DemandHeatmapProps {
  points: HeatmapPoint[];
}

export function DemandHeatmap({ points }: DemandHeatmapProps) {
  if (points.length === 0) return null;

  return (
    <Heatmap
      points={points}
      radius={50}
      opacity={0.65}
      gradient={{
        colors: ['#1e3a8a', '#2170e4', '#f59e0b', '#dc2626'],
        startPoints: [0.1, 0.35, 0.65, 0.9],
        colorMapSize: 256,
      }}
    />
  );
}
