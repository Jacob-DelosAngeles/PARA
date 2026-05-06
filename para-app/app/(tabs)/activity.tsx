import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { TopAppBar } from '@/components/navigation/TopAppBar';
import { Card } from '@/components/ui/Card';
import { Typography } from '@/components/ui/Typography';
import { COLORS } from '@/lib/constants';
import { usePoints } from '@/hooks/usePoints';
import { useAuthStore } from '@/store/authStore';
import { formatDistanceToNow } from 'date-fns';

export default function ActivityScreen() {
  const { points, ledger, leaderboard } = usePoints();
  const { session, isGuest } = useAuthStore();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.surface }}>
      <TopAppBar title="Activity" showWordmark={false} />
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingTop: 72, gap: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Points balance hero */}
        <View
          style={{
            backgroundColor: COLORS.primary,
            borderRadius: 28,
            padding: 28,
            alignItems: 'center',
            shadowColor: COLORS.primary,
            shadowOffset: { width: 0, height: 12 },
            shadowOpacity: 0.25,
            shadowRadius: 28,
            elevation: 10,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              backgroundColor: 'rgba(255,255,255,0.12)',
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 999,
              marginBottom: 12,
            }}
          >
            <Ionicons name="sparkles" size={12} color="rgba(255,255,255,0.9)" />
            <Typography
              variant="label"
              color="rgba(255,255,255,0.9)"
              style={{ fontFamily: 'Manrope_700Bold', letterSpacing: 1 }}
            >
              PARA POINTS
            </Typography>
          </View>
          <Typography
            style={{
              fontFamily: 'SpaceGrotesk_700Bold',
              fontSize: 80,
              color: '#ffffff',
              letterSpacing: -3,
              lineHeight: 86,
            }}
          >
            {points}
          </Typography>
          <Typography
            variant="body"
            color="rgba(255,255,255,0.65)"
            style={{ marginTop: 8 }}
          >
            Keep reporting to earn more
          </Typography>
        </View>

        {/* Recent activity */}
        {!isGuest && session && ledger.length > 0 && (
          <View>
            <Typography
              variant="title"
              color={COLORS.onSurface}
              style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 16, marginBottom: 12 }}
            >
              Recent Activity
            </Typography>
            <View style={{ gap: 8 }}>
              {ledger.map((entry) => {
                const isReport = entry.reason === 'report_submitted';
                return (
                  <Card key={entry.id} variant="lowest" padding={16} radius={16}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
                        <View
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: 12,
                            backgroundColor: `${COLORS.primary}10`,
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Ionicons
                            name={isReport ? 'flag' : 'checkmark-circle'}
                            size={18}
                            color={COLORS.primary}
                          />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Typography
                            variant="body"
                            color={COLORS.onSurface}
                            style={{ fontFamily: 'Manrope_600SemiBold' }}
                          >
                            {isReport ? 'Report submitted' : 'Report validated'}
                          </Typography>
                          <Typography variant="label" color={COLORS.outline}>
                            {formatDistanceToNow(new Date(entry.created_at), { addSuffix: true })}
                          </Typography>
                        </View>
                      </View>
                      <Typography
                        style={{
                          fontFamily: 'SpaceGrotesk_700Bold',
                          fontSize: 16,
                          color: entry.delta > 0 ? '#16a34a' : COLORS.error,
                        }}
                      >
                        {entry.delta > 0 ? '+' : ''}{entry.delta}
                      </Typography>
                    </View>
                  </Card>
                );
              })}
            </View>
          </View>
        )}

        {/* Leaderboard */}
        {!isGuest && (
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Ionicons name="trophy" size={18} color="#f59e0b" />
              <Typography
                variant="title"
                color={COLORS.onSurface}
                style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 16 }}
              >
                Leaderboard
              </Typography>
            </View>
            <View style={{ gap: 8 }}>
              {leaderboard.map((user, index) => {
                const rankColors = ['#f59e0b', '#9ca3af', '#b45309'];
                const isMe = session?.user.id === user.id;
                return (
                  <Card
                    key={user.id}
                    variant="lowest"
                    padding={14}
                    radius={16}
                    style={isMe ? { borderWidth: 2, borderColor: COLORS.primaryFixedDim } : {}}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                      <View
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 16,
                          backgroundColor: index < 3 ? `${rankColors[index]}20` : COLORS.surfaceContainerHigh,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Typography
                          style={{
                            fontFamily: 'SpaceGrotesk_700Bold',
                            fontSize: 14,
                            color: index < 3 ? rankColors[index] : COLORS.outline,
                          }}
                        >
                          {index + 1}
                        </Typography>
                      </View>
                      <View
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 18,
                          backgroundColor: COLORS.primaryFixed,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Ionicons name="person" size={16} color={COLORS.primary} />
                      </View>
                      <Typography
                        variant="body"
                        color={COLORS.onSurface}
                        style={{ flex: 1, fontFamily: isMe ? 'Manrope_700Bold' : 'Manrope_400Regular' }}
                      >
                        {user.display_name} {isMe ? '(You)' : ''}
                      </Typography>
                      <Typography
                        style={{
                          fontFamily: 'SpaceGrotesk_700Bold',
                          fontSize: 16,
                          color: index < 3 ? rankColors[index] : COLORS.primary,
                        }}
                      >
                        {user.points}
                      </Typography>
                    </View>
                  </Card>
                );
              })}
            </View>
          </View>
        )}

        {isGuest && (
          <Card variant="lowest" padding={28} radius={24} style={{ alignItems: 'center', gap: 12 }}>
            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: 20,
                backgroundColor: `${COLORS.primary}10`,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="trophy" size={32} color={COLORS.primary} />
            </View>
            <Typography
              style={{
                fontFamily: 'SpaceGrotesk_700Bold',
                fontSize: 18,
                color: COLORS.onSurface,
                textAlign: 'center',
                lineHeight: 24,
              }}
            >
              Create an account to earn PARA Points
            </Typography>
            <Typography variant="body" color={COLORS.outline} style={{ textAlign: 'center', lineHeight: 20 }}>
              Report incidents and validate community reports to earn points and climb the leaderboard.
            </Typography>
          </Card>
        )}

        <View style={{ height: 16 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
