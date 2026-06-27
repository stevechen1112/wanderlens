import React, { useEffect, useState, useCallback } from 'react'
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
  RefreshControl, Dimensions, Image,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { shadows, useColors, type AppColors } from '@/theme'
import { bookingApi, contentApi, matchApi, recallApi } from '@/api'
import MemoryRecallSection, { type RecallItem } from '@/components/MemoryRecallSection'
import { useAuthStore } from '@/stores/authStore'
import { useLocale } from '@/i18n'

const { width } = Dimensions.get('window')
const CARD_WIDTH = (width - 48) / 2
const FEATURED_WIDTH = width * 0.42

interface FeaturedAlbum {
  id: number
  title?: string
  coverUrl?: string
  shootLocation?: string
  thumbnailUrl?: string
}

interface LocationInspiration {
  id: number
  name: string
  area?: string
  photoUrl?: string
}

export default function HomeScreen({ navigation }: { navigation: any }) {
  const colors = useColors()
  const styles = React.useMemo(() => makeStyles(colors), [colors])
  const { t } = useLocale()
  const { user } = useAuthStore()
  const [refreshing, setRefreshing] = useState(false)
  const [featuredAlbums, setFeaturedAlbums] = useState<FeaturedAlbum[]>([])
  const [locations, setLocations] = useState<LocationInspiration[]>([])
  const [serviceTypes, setServiceTypes] = useState<any[]>([])
  const [instantEnabled, setInstantEnabled] = useState(false)
  const [recallItems, setRecallItems] = useState<RecallItem[]>([])
  const [recallLoading, setRecallLoading] = useState(false)

  const loadData = useCallback(async () => {
    try {
      const [typesRes, attractionsRes, publicRes, matchStatusRes]: any[] = await Promise.all([
        bookingApi.getServiceTypes(),
        contentApi.getAttractions().catch(() => ({ data: [] })),
        contentApi.getPublicAlbums().catch(() => ({ data: [] })),
        matchApi.getPublicStatus().catch(() => ({ data: { instantMatchEnabled: false } })),
      ])
      setServiceTypes(typesRes.data || [])
      setInstantEnabled(!!matchStatusRes.data?.instantMatchEnabled)

      const attractions = attractionsRes.data || []
      if (attractions.length > 0) {
        setLocations(attractions.slice(0, 8).map((a: any) => ({
          id: a.id,
          name: a.name,
          area: a.area,
          photoUrl: a.imageUuid ? `${process.env.EXPO_PUBLIC_API_BASE || 'http://localhost:8080/api'}/files/${a.imageUuid}` : undefined,
        })))
      } else {
        setLocations([
          { id: 1, name: '大稻埕', area: '台北市' },
          { id: 2, name: '陽明山', area: '台北市' },
          { id: 3, name: '淡水老街', area: '新北市' },
          { id: 4, name: '九份', area: '新北市' },
          { id: 5, name: '西門町', area: '台北市' },
        ])
      }

      const publicAlbums = publicRes.data || []
      setFeaturedAlbums(publicAlbums.slice(0, 10))
    } catch {
      // 靜默處理
    }
  }, [])

  const loadRecall = useCallback(async () => {
    if (!user) return
    setRecallLoading(true)
    try {
      const res: any = await recallApi.getFeed()
      setRecallItems(res.data || [])
    } catch {
      setRecallItems([])
    } finally {
      setRecallLoading(false)
    }
  }, [user])

  useEffect(() => {
    loadData()
    loadRecall()
  }, [loadData, loadRecall])

  const onRefresh = async () => {
    setRefreshing(true)
    await Promise.all([loadData(), loadRecall()])
    setRefreshing(false)
  }

  const handleRecallPress = (item: RecallItem) => {
    if (item.albumId) {
      navigation.navigate('Albums', { screen: 'AlbumDetail', params: { albumId: item.albumId } })
    } else {
      navigation.navigate('Profile', { screen: 'ShootingHistory' })
    }
  }

  const goToBooking = (prefillLocation?: string) => {
    navigation.navigate('Booking', prefillLocation ? { prefillLocation } : undefined)
  }

  const goToAlbums = () => {
    navigation.navigate('Albums', { screen: 'AlbumList' })
  }

  const goToOrders = () => {
    navigation.navigate('Profile', { screen: 'OrderList' })
  }

  const goToHistory = () => {
    navigation.navigate('Profile', { screen: 'ShootingHistory' })
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          style={styles.searchBar}
          onPress={() => goToBooking()}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="搜尋地點或拍攝類型"
        >
          <Ionicons name="search-outline" size={20} color={colors.textSecondary} />
          <Text style={styles.searchPlaceholder}>搜尋地點或拍攝類型</Text>
        </TouchableOpacity>

        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>
            {user?.username ? `${user.username}，` : ''}想拍什麼呢？
          </Text>
          <Text style={styles.welcomeSub}>探索地點靈感，或立即預約專業攝影師</Text>
        </View>

        <View style={styles.dualCardRow}>
          <TouchableOpacity
            style={[styles.entryCard, styles.instantCard, !instantEnabled && styles.entryCardDisabled]}
            onPress={() => {
              if (!instantEnabled) return
              navigation.getParent()?.navigate('InstantShoot')
            }}
            activeOpacity={instantEnabled ? 0.85 : 1}
          >
            <View style={styles.entryCardIconWrap}>
              <Ionicons name="flash" size={28} color={colors.primary} />
            </View>
            <Text style={styles.entryCardTitle}>即時拍攝</Text>
            <Text style={styles.entryCardDesc}>
              {instantEnabled ? '60 秒找到攝影師' : '即將開放'}
            </Text>
            {instantEnabled ? (
              <View style={styles.entryCardBadge}>
                <Text style={styles.entryCardBadgeText}>LIVE</Text>
              </View>
            ) : null}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.entryCard, styles.bookingCard]}
            onPress={() => goToBooking()}
            activeOpacity={0.85}
          >
            <View style={[styles.entryCardIconWrap, { backgroundColor: colors.white }]}>
              <Ionicons name="calendar-outline" size={28} color={colors.secondary} />
            </View>
            <Text style={styles.entryCardTitle}>預約拍攝</Text>
            <Text style={styles.entryCardDesc}>瀏覽作品挑選預約</Text>
          </TouchableOpacity>
        </View>

        <MemoryRecallSection
          items={recallItems}
          loading={recallLoading}
          onPressItem={handleRecallPress}
          onPressViewAll={goToHistory}
        />

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>熱門拍攝地點</Text>
            <TouchableOpacity onPress={() => goToBooking()}>
              <Text style={styles.sectionMore}>查看全部</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.locationScroll}>
            {locations.map(loc => (
              <TouchableOpacity
                key={loc.id}
                style={styles.locationCard}
                onPress={() => goToBooking(loc.name)}
                activeOpacity={0.85}
              >
                {loc.photoUrl ? (
                  <Image source={{ uri: loc.photoUrl }} style={styles.locationImage} />
                ) : (
                  <View style={styles.locationImagePlaceholder}>
                    <Ionicons name="location-outline" size={24} color={colors.primary} />
                  </View>
                )}
                <Text style={styles.locationName} numberOfLines={1}>{loc.name}</Text>
                {loc.area ? <Text style={styles.locationArea} numberOfLines={1}>{loc.area}</Text> : null}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {featuredAlbums.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>精選作品</Text>
              <TouchableOpacity onPress={goToAlbums}>
                <Text style={styles.sectionMore}>我的相簿</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.featuredScroll}>
              {featuredAlbums.map(album => (
                <TouchableOpacity
                  key={album.id}
                  style={styles.featuredCard}
                  activeOpacity={0.9}
                  onPress={() => navigation.navigate('Albums', { screen: 'AlbumDetail', params: { albumId: album.id } })}
                >
                  {(album.coverUrl || album.thumbnailUrl) ? (
                    <Image
                      source={{ uri: album.coverUrl || album.thumbnailUrl }}
                      style={styles.featuredImage}
                    />
                  ) : (
                    <View style={[styles.featuredImage, styles.featuredPlaceholder]}>
                      <Ionicons name="images-outline" size={32} color={colors.textSecondary} />
                    </View>
                  )}
                  <View style={styles.featuredOverlay}>
                    <Text style={styles.featuredTitle} numberOfLines={1}>{album.title || '精選作品'}</Text>
                    {album.shootLocation ? (
                      <Text style={styles.featuredLocation} numberOfLines={1}>{album.shootLocation}</Text>
                    ) : null}
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>拍攝類型</Text>
          </View>
          <View style={styles.typeGrid}>
            {serviceTypes.slice(0, 6).map((type: any) => (
              <TouchableOpacity
                key={type.id}
                style={styles.typeCard}
                onPress={() => goToBooking()}
                activeOpacity={0.85}
              >
                <View style={styles.typeIconWrap}>
                  <Ionicons name="camera-outline" size={22} color={colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.typeName} numberOfLines={1}>{type.name}</Text>
                  {(type.basePrice || type.price) ? (
                    <Text style={styles.typePrice}>
                      ${(type.basePrice || type.price)?.toLocaleString()} 起
                    </Text>
                  ) : null}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>我的拍攝</Text>
          </View>
          <View style={styles.quickRow}>
            <TouchableOpacity style={styles.quickCard} onPress={goToOrders} activeOpacity={0.85}>
              <View style={[styles.quickIconWrap, { backgroundColor: colors.secondaryLight }]}>
                <Ionicons name="clipboard-outline" size={22} color={colors.secondary} />
              </View>
              <Text style={styles.quickLabel}>我的訂單</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickCard} onPress={goToAlbums} activeOpacity={0.85}>
              <View style={[styles.quickIconWrap, { backgroundColor: colors.primaryLight }]}>
                <Ionicons name="images-outline" size={22} color={colors.primary} />
              </View>
              <Text style={styles.quickLabel}>我的相簿</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickCard} onPress={goToHistory} activeOpacity={0.85}>
              <View style={[styles.quickIconWrap, { backgroundColor: colors.warningLight }]}>
                <Ionicons name="map-outline" size={22} color={colors.warning} />
              </View>
              <Text style={styles.quickLabel}>拍攝歷程</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  )
}

const makeStyles = (colors: AppColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollView: { flex: 1 },
  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: 16, marginTop: 8, marginBottom: 4,
    backgroundColor: colors.surface, borderRadius: 14,
    paddingHorizontal: 16, paddingVertical: 14,
    borderWidth: 1, borderColor: colors.border,
    ...shadows.sm,
  },
  searchPlaceholder: { fontSize: 15, color: colors.textSecondary, marginLeft: 10 },
  welcomeSection: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  welcomeText: { fontSize: 24, fontWeight: '800', color: colors.textPrimary, letterSpacing: -0.3 },
  welcomeSub: { fontSize: 14, color: colors.textSecondary, marginTop: 6 },

  dualCardRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 12, marginBottom: 28, marginTop: 8 },
  entryCard: {
    flex: 1, borderRadius: 20, padding: 20, position: 'relative',
    ...shadows.md,
  },
  instantCard: { backgroundColor: colors.primaryLight },
  entryCardDisabled: { opacity: 0.55 },
  bookingCard: { backgroundColor: colors.secondaryLight },
  entryCardIconWrap: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: colors.white, justifyContent: 'center', alignItems: 'center', marginBottom: 14,
  },
  entryCardTitle: { fontSize: 18, fontWeight: '800', color: colors.textPrimary, marginBottom: 4 },
  entryCardDesc: { fontSize: 13, color: colors.textRegular, lineHeight: 18 },
  entryCardBadge: {
    position: 'absolute', top: 14, right: 14,
    backgroundColor: colors.primary, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3,
  },
  entryCardBadgeText: { fontSize: 10, fontWeight: '800', color: colors.white },

  section: { marginBottom: 28 },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, marginBottom: 14,
  },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: colors.textPrimary },
  sectionMore: { fontSize: 14, fontWeight: '600', color: colors.primary },

  locationScroll: { paddingHorizontal: 16 },
  locationCard: {
    width: 120, marginRight: 12, borderRadius: 16,
    backgroundColor: colors.surface, overflow: 'hidden',
    ...shadows.sm,
  },
  locationImage: { width: '100%', height: 90 },
  locationImagePlaceholder: {
    width: '100%', height: 90, backgroundColor: colors.primaryLight,
    justifyContent: 'center', alignItems: 'center',
  },
  locationName: { fontSize: 14, fontWeight: '700', color: colors.textPrimary, paddingHorizontal: 10, paddingTop: 10 },
  locationArea: { fontSize: 12, color: colors.textSecondary, paddingHorizontal: 10, paddingBottom: 10, paddingTop: 2 },

  featuredScroll: { paddingHorizontal: 16 },
  featuredCard: {
    width: FEATURED_WIDTH, height: FEATURED_WIDTH * 1.25, marginRight: 12,
    borderRadius: 16, overflow: 'hidden',
    ...shadows.md,
  },
  featuredImage: { width: '100%', height: '100%' },
  featuredPlaceholder: { backgroundColor: colors.border, justifyContent: 'center', alignItems: 'center' },
  featuredOverlay: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: 12, backgroundColor: colors.overlay,
  },
  featuredTitle: { fontSize: 14, fontWeight: '700', color: colors.white },
  featuredLocation: { fontSize: 12, color: 'rgba(255,255,255,0.85)', marginTop: 2 },

  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 10 },
  typeCard: {
    width: CARD_WIDTH - 5, backgroundColor: colors.surface, borderRadius: 14,
    padding: 14, flexDirection: 'row', alignItems: 'center',
    ...shadows.sm,
  },
  typeIconWrap: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primaryLight,
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  typeName: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  typePrice: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },

  quickRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 12 },
  quickCard: {
    flex: 1, backgroundColor: colors.surface, borderRadius: 16,
    paddingVertical: 18, alignItems: 'center',
    ...shadows.sm,
  },
  quickIconWrap: {
    width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center',
  },
  quickLabel: { fontSize: 13, fontWeight: '700', color: colors.textPrimary, marginTop: 10 },
})
