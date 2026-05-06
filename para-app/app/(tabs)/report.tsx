import { useState } from 'react';
import { View, ScrollView, TextInput, Alert, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { TopAppBar } from '@/components/navigation/TopAppBar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Typography } from '@/components/ui/Typography';
import { ReportTypeSelector } from '@/components/report/ReportTypeSelector';
import { COLORS } from '@/lib/constants';
import { useLocationStore } from '@/store/locationStore';
import { useAuthStore } from '@/store/authStore';
import { supabase } from '@/lib/supabase';

type ReportType = 'accident' | 'pothole' | 'traffic';

export default function ReportScreen() {
  const [reportType, setReportType] = useState<ReportType | null>(null);
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const coords = useLocationStore((s) => s.coords);
  const { session, isGuest } = useAuthStore();

  async function pickImage() {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: 'images',
      quality: 0.7,
    });
    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  }

  async function handleSubmit() {
    if (!reportType) {
      Alert.alert('Select type', 'Please select a report type.');
      return;
    }
    if (!coords) {
      Alert.alert('No location', 'Location is required to submit a report.');
      return;
    }
    if (isGuest || !session) {
      Alert.alert('Sign in required', 'Please create an account to submit reports.');
      return;
    }

    setSubmitting(true);
    try {
      let imageUrl: string | null = null;

      // Upload image if selected
      if (imageUri) {
        const ext = imageUri.split('.').pop() ?? 'jpg';
        const fileName = `${session.user.id}/${Date.now()}.${ext}`;
        const response = await fetch(imageUri);
        const blob = await response.blob();
        const { error: uploadError } = await supabase.storage
          .from('report-images')
          .upload(fileName, blob, { contentType: `image/${ext}` });
        if (!uploadError) {
          const { data } = supabase.storage.from('report-images').getPublicUrl(fileName);
          imageUrl = data.publicUrl;
        }
      }

      // Insert report
      const { error } = await supabase.from('reports').insert({
        reporter_id: session.user.id,
        type: reportType,
        description: description || null,
        location: `POINT(${coords.longitude} ${coords.latitude})`,
        image_url: imageUrl,
      });

      if (error) throw error;

      // Add points
      await supabase.from('points_ledger').insert({
        user_id: session.user.id,
        delta: 10,
        reason: 'report_submitted',
      });
      await supabase.rpc('increment_points', { uid: session.user.id, amount: 10 });

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setReportType(null);
        setDescription('');
        setImageUri(null);
      }, 2500);
    } catch {
      Alert.alert('Error', 'Failed to submit report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.surface, alignItems: 'center', justifyContent: 'center' }}>
        <View
          style={{
            width: 88,
            height: 88,
            borderRadius: 44,
            backgroundColor: '#22c55e',
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#22c55e',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 20,
            elevation: 8,
          }}
        >
          <Ionicons name="checkmark" size={48} color="#ffffff" />
        </View>
        <Typography
          style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 24, color: COLORS.onSurface, marginTop: 24 }}
        >
          Report Submitted!
        </Typography>
        <View
          style={{
            backgroundColor: COLORS.primaryFixed,
            borderRadius: 999,
            paddingHorizontal: 16,
            paddingVertical: 8,
            marginTop: 12,
          }}
        >
          <Typography
            style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 16, color: COLORS.primary }}
          >
            +10 pts
          </Typography>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.surface }}>
      <TopAppBar title="File a Report" showWordmark={false} />
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingTop: 72, gap: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Report type */}
        <Card variant="low" padding={20}>
          <Typography
            variant="title"
            color={COLORS.onSurface}
            style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 16, marginBottom: 12 }}
          >
            What happened?
          </Typography>
          <ReportTypeSelector selected={reportType} onSelect={setReportType} />
        </Card>

        {/* Description */}
        <Card variant="low" padding={20}>
          <Typography
            variant="label"
            color={COLORS.onSurfaceVariant}
            style={{ fontFamily: 'Manrope_600SemiBold', marginBottom: 8 }}
          >
            Description (optional)
          </Typography>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Describe what you see..."
            placeholderTextColor={COLORS.outlineVariant}
            multiline
            numberOfLines={3}
            style={{
              backgroundColor: COLORS.surfaceContainerLowest,
              borderRadius: 12,
              padding: 14,
              fontFamily: 'Manrope_400Regular',
              fontSize: 14,
              color: COLORS.onSurface,
              textAlignVertical: 'top',
              minHeight: 80,
            }}
          />
        </Card>

        {/* GPS tag */}
        <Card variant="low" padding={20}>
          <Typography
            variant="label"
            color={COLORS.onSurfaceVariant}
            style={{ fontFamily: 'Manrope_600SemiBold', marginBottom: 8 }}
          >
            Location
          </Typography>
          <View
            style={{
              backgroundColor: COLORS.surfaceContainerLowest,
              borderRadius: 12,
              padding: 14,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <Ionicons name="location" size={18} color={COLORS.primary} />
            <Typography variant="body" color={coords ? COLORS.onSurface : COLORS.outline}>
              {coords
                ? `${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)}`
                : 'Acquiring GPS...'}
            </Typography>
          </View>
        </Card>

        {/* Photo */}
        <Card variant="low" padding={20}>
          <Typography
            variant="label"
            color={COLORS.onSurfaceVariant}
            style={{ fontFamily: 'Manrope_600SemiBold', marginBottom: 8 }}
          >
            Photo (optional)
          </Typography>
          {imageUri ? (
            <View>
              <Image
                source={{ uri: imageUri }}
                style={{ width: '100%', height: 160, borderRadius: 12 }}
                resizeMode="cover"
              />
              <Pressable
                onPress={() => setImageUri(null)}
                style={{ marginTop: 8, alignItems: 'center' }}
              >
                <Typography variant="label" color={COLORS.error} style={{ fontFamily: 'Manrope_600SemiBold' }}>
                  Remove photo
                </Typography>
              </Pressable>
            </View>
          ) : (
            <Pressable
              onPress={pickImage}
              style={({ pressed }) => ({
                height: 120,
                borderRadius: 14,
                borderWidth: 1.5,
                borderColor: `${COLORS.outlineVariant}99`,
                borderStyle: 'dashed',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                backgroundColor: COLORS.surfaceContainerLowest,
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <Ionicons name="camera-outline" size={28} color={COLORS.primary} />
              <Typography variant="body" color={COLORS.onSurfaceVariant} style={{ fontFamily: 'Manrope_600SemiBold' }}>
                Take a photo
              </Typography>
            </Pressable>
          )}
        </Card>

        <Button
          label={submitting ? 'Submitting...' : 'Submit Report'}
          variant="primary"
          size="lg"
          fullWidth
          disabled={submitting || !reportType}
          onPress={handleSubmit}
        />

        <View style={{ height: 16 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
