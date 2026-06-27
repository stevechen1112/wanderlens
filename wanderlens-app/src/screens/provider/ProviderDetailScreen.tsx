import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  View, Text, ScrollView, Image, StyleSheet, TouchableOpacity,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useColors, spacing, radius, type AppColors } from '@/theme'
import ScreenHeader from '@/components/ScreenHeader'
import StateView from '@/components/StateView'
import { providerApi, type ProviderPublicProfile } from '@/api'
import { useLocale } from '@/i18n'

const FEATURE_LABELS: Record<string, string> = {
  style: '風格',
  service: '服務',
  equipment: '器材',
}

export default function ProviderDetailScreen({ route, navigation }: any) {
  const colors = useColors()
  const styles = useMemo(() => makeStyles(colors), [colors])
  const { t } = useLocale()
  const providerUuid = route.params?.providerUuid as string
  const [profile, setProfile] = useState<ProviderPublicProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError(false)
    try {
      const res = await providerApi.getPublicProfile(providerUuid)
      setProfile(res.data ?? null)
    } catch {
      setError(true)
      setProfile(null)
    } finally {
      setLoading(false)
    }
  }, [providerUuid])

  useEffect(() => { load() }, [load])

  const p = profile?.provider
  const displayName = p?.nickName || p?.name || ''
  const unitPrice = p?.unitPrice && p.unitPrice > 0 ? p.unitPrice : 800
  const twFeatures = (profile?.features || []).filter(f => f.language === 'tw' || !f.language)

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScreenHeader title={t('providerDetail.title')} onBack={() => navigation.goBack()} />
        <StateView type="loading" />
      </SafeAreaView>
    )
  }

  if (error || !p) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScreenHeader title={t('providerDetail.title')} onBack={() => navigation.goBack()} />
        <StateView type="error" onRetry={load} />
      </SafeAreaView>
    )
  }

  const gallery = [p.bannerImg, ...(profile?.works || []).map(w => w.imageUrl).filter(Boolean)].filter(Boolean) as string[]

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader title={displayName} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll}>
        {gallery[0] ? (
          <Image source={{ uri: gallery[0] }} style={styles.hero} resizeMode="cover" />
        ) : (
          <View style={[styles.hero, styles.heroPlaceholder]}>
            <Ionicons name="camera" size={40} color={colors.textSecondary} />
          </View>
        )}

        <View style={styles.body}>
          <View style={styles.titleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{displayName}</Text>
              <View style={styles.metaRow}>
                <Ionicons name="star" size={14} color={colors.warning} />
                <Text style={styles.metaText}>
                  {(profile?.ratingSummary?.averageRating ?? p.rating ?? 0).toFixed?.(1) || '5.0'}
                  {profile?.ratingSummary?.totalCount ? ` · ${profile.ratingSummary.totalCount} 則評價` : ''}
                </Text>
              </View>
              {p.city ? (
                <View style={styles.metaRow}>
                  <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
                  <Text style={styles.metaText}>{[p.city, p.districtName].filter(Boolean).join(' · ')}</Text>
                </View>
              ) : null}
            </View>
            {p.avatar ? (
              <Image source={{ uri: p.avatar }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarFallback]}>
                <Text style={styles.avatarText}>{displayName.charAt(0)}</Text>
              </View>
            )}
          </View>

          {(p.career || p.experience != null) ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('providerDetail.professional')}</Text>
              <Text style={styles.bodyText}>
                {[p.career, p.experience != null ? `${p.experience} 年` : ''].filter(Boolean).join(' · ')}
              </Text>
            </View>
          ) : null}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('providerDetail.about')}</Text>
            <Text style={styles.bodyText}>{p.intro || t('providerDetail.noIntro')}</Text>
          </View>

          {(profile?.serviceTypes?.length || 0) > 0 ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('providerDetail.services')}</Text>
              <View style={styles.tagRow}>
                {profile!.serviceTypes!.map(st => (
                  <View key={st.id} style={styles.tag}><Text style={styles.tagText}>{st.name}</Text></View>
                ))}
              </View>
            </View>
          ) : null}

          {twFeatures.length > 0 ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('providerDetail.features')}</Text>
              {twFeatures.map(f => (
                <View key={f.id} style={styles.featureItem}>
                  <Text style={styles.featureType}>{FEATURE_LABELS[f.featureType] || f.featureType}</Text>
                  <Text style={styles.bodyText}>{f.featureContent}</Text>
                </View>
              ))}
            </View>
          ) : null}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('providerDetail.works')}</Text>
            {(profile?.works?.length || 0) > 0 ? (
              <View style={styles.worksGrid}>
                {profile!.works!.map(w => (
                  <Image key={w.id} source={{ uri: w.imageUrl }} style={styles.workThumb} />
                ))}
              </View>
            ) : (
              <Text style={styles.muted}>{t('providerDetail.noWorks')}</Text>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('providerDetail.areas')}</Text>
            <Text style={styles.bodyText}>
              {(profile?.serviceAreaNames?.length || 0) > 0
                ? profile!.serviceAreaNames!.join('、')
                : [p.city, p.districtName].filter(Boolean).join('、') || t('providerDetail.noAreas')}
            </Text>
          </View>

          <View style={styles.priceCard}>
            <Text style={styles.priceLabel}>{t('providerDetail.hourlyRate')}</Text>
            <Text style={styles.priceValue}>${unitPrice.toLocaleString()}<Text style={styles.priceUnit}>/hr</Text></Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const makeStyles = (colors: AppColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingBottom: spacing.xl },
  hero: { width: '100%', height: 200, backgroundColor: colors.border },
  heroPlaceholder: { alignItems: 'center', justifyContent: 'center' },
  body: { padding: spacing.lg, gap: spacing.md },
  titleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  name: { fontSize: 24, fontWeight: '800', color: colors.textPrimary },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  metaText: { fontSize: 13, color: colors.textSecondary },
  avatar: { width: 56, height: 56, borderRadius: 28 },
  avatarFallback: { backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: colors.white, fontSize: 22, fontWeight: '800' },
  section: { gap: spacing.sm },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: colors.textPrimary },
  bodyText: { fontSize: 15, lineHeight: 22, color: colors.textSecondary },
  muted: { fontSize: 14, color: colors.textSecondary },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: { backgroundColor: colors.primary + '18', paddingHorizontal: 12, paddingVertical: 6, borderRadius: radius.full },
  tagText: { color: colors.primary, fontSize: 13, fontWeight: '600' },
  featureItem: { gap: 2, marginBottom: 8 },
  featureType: { fontSize: 13, fontWeight: '700', color: colors.textPrimary },
  worksGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  workThumb: { width: '31%', aspectRatio: 1, borderRadius: radius.md, backgroundColor: colors.border },
  priceCard: {
    marginTop: spacing.sm,
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  priceLabel: { fontSize: 12, color: colors.textSecondary, fontWeight: '600' },
  priceValue: { fontSize: 28, fontWeight: '800', color: colors.textPrimary, marginTop: 4 },
  priceUnit: { fontSize: 14, fontWeight: '600', color: colors.textSecondary },
})
