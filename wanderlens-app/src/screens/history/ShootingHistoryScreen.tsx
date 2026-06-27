import React, { useState, useEffect, useCallback, useMemo } from 'react'
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions, Platform, RefreshControl,
} from 'react-native'
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { shadows, useColors, type AppColors } from '@/theme'
import { albumApi } from '@/api'
import ScreenHeader from '@/components/ScreenHeader'
import StateView from '@/components/StateView'

const { width, height } = Dimensions.get('window')

interface AlbumItem {
  id: number
  title?: string
  shootingDate?: string
  shootDate?: string
  shootingLocation?: string
  shootLocation?: string
  city?: string
  coverUrl?: string
  lat?: number
  lng?: number
  addrLat?: number
  addrLng?: number
}

type ViewMode = 'timeline' | 'map'

const TAIWAN_REGION = {
  latitude: 23.7,
  longitude: 120.9,
  latitudeDelta: 4.5,
  longitudeDelta: 3.5,
}

export default function ShootingHistoryScreen({ navigation }: { navigation: any }) {
  const colors = useColors()
  const styles = React.useMemo(() => makeStyles(colors), [colors])
  const [mode, setMode] = useState<ViewMode>('timeline')
  const [albums, setAlbums] = useState<AlbumItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  const loadAlbums = useCallback(async () => {
    setError(false)
    try {
      const res: any = await albumApi.myAlbums()
      setAlbums(res.data || [])
    } catch {
      setError(true)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    loadAlbums()
  }, [loadAlbums])

  const getDate = (album: AlbumItem) => album.shootingDate || album.shootDate

  const albumsByYear = albums.reduce((acc, album) => {
    const dateStr = getDate(album)
    const year = dateStr ? new Date(dateStr).getFullYear() : new Date().getFullYear()
    if (!acc[year]) acc[year] = []
    acc[year].push(album)
    return acc
  }, {} as Record<number, AlbumItem[]>)

  const years = Object.keys(albumsByYear).map(Number).sort((a, b) => b - a)
  const currentYearAlbums = albumsByYear[selectedYear] || []

  const geoAlbums = useMemo(() => albums.map(a => ({
    ...a,
    lat: a.lat ?? a.addrLat,
    lng: a.lng ?? a.addrLng,
  })).filter(a => a.lat && a.lng), [albums])

  const mapRegion = useMemo(() => {
    if (geoAlbums.length === 0) return TAIWAN_REGION
    const lats = geoAlbums.map(a => a.lat!)
    const lngs = geoAlbums.map(a => a.lng!)
    const minLat = Math.min(...lats)
    const maxLat = Math.max(...lats)
    const minLng = Math.min(...lngs)
    const maxLng = Math.max(...lngs)
    return {
      latitude: (minLat + maxLat) / 2,
      longitude: (minLng + maxLng) / 2,
      latitudeDelta: Math.max(0.08, (maxLat - minLat) * 1.8 + 0.05),
      longitudeDelta: Math.max(0.08, (maxLng - minLng) * 1.8 + 0.05),
    }
  }, [geoAlbums])

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}`
  }

  const formatDay = (dateStr?: string) => {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    return `${d.getMonth() + 1}月${d.getDate()}日`
  }

  const openAlbum = (albumId: number) => {
    navigation.navigate('Albums', { screen: 'AlbumDetail', params: { albumId } })
  }

  const renderTimelineItem = (album: AlbumItem) => (
    <TouchableOpacity
      key={album.id}
      style={styles.timelineCard}
      onPress={() => openAlbum(album.id)}
      activeOpacity={0.85}
    >
      <View style={styles.timelineDate}>
        <Text style={styles.timelineDateText}>{formatDay(getDate(album))}</Text>
      </View>
      <View style={styles.timelineLine}>
        <View style={styles.timelineDot} />
      </View>
      <View style={styles.timelineContent}>
        <Text style={styles.timelineTitle}>
          {album.title || album.shootLocation || album.shootingLocation || '拍攝紀錄'}
        </Text>
        {(album.city || album.shootLocation) ? (
          <View style={styles.timelineLocation}>
            <Ionicons name="location-outline" size={12} color={colors.textSecondary} />
            <Text style={styles.timelineLocationText}>{album.city || album.shootLocation}</Text>
          </View>
        ) : null}
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
    </TouchableOpacity>
  )

  const renderMapView = () => (
    <View style={styles.mapContainer}>
      <MapView
        style={styles.map}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        initialRegion={mapRegion}
        showsUserLocation={false}
        showsCompass
      >
        {geoAlbums.map(album => (
          <Marker
            key={album.id}
            coordinate={{ latitude: album.lat!, longitude: album.lng! }}
            pinColor={colors.primary}
          >
            <Callout onPress={() => openAlbum(album.id)}>
              <View style={styles.callout}>
                <Text style={styles.calloutTitle}>
                  {album.title || album.shootLocation || '拍攝紀錄'}
                </Text>
                <Text style={styles.calloutDate}>{formatDate(getDate(album))}</Text>
                <Text style={styles.calloutAction}>點擊查看作品 →</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      {geoAlbums.length === 0 && (
        <View style={styles.mapEmptyOverlay}>
          <Ionicons name="map-outline" size={48} color={colors.textSecondary} />
          <Text style={styles.mapEmptyText}>尚無地點座標資料</Text>
          <Text style={styles.mapEmptySub}>完成拍攝後，地點會自動顯示在地圖上</Text>
        </View>
      )}

      {geoAlbums.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.mapCarousel}
          contentContainerStyle={styles.mapCarouselContent}
        >
          {geoAlbums.map(album => (
            <TouchableOpacity
              key={album.id}
              style={styles.mapChip}
              onPress={() => openAlbum(album.id)}
              activeOpacity={0.85}
            >
              <Ionicons name="pin" size={16} color={colors.primary} />
              <Text style={styles.mapChipText} numberOfLines={1}>
                {album.title || album.shootLocation || '拍攝'}
              </Text>
              <Text style={styles.mapChipDate}>{formatDate(getDate(album))}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  )

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader title="拍攝歷程" onBack={() => navigation.goBack()} />

      <View style={styles.modeSwitch}>
        <TouchableOpacity
          style={[styles.modeBtn, mode === 'timeline' && styles.modeBtnActive]}
          onPress={() => setMode('timeline')}
          accessibilityRole="button"
          accessibilityState={{ selected: mode === 'timeline' }}
          accessibilityLabel="時間軸檢視"
        >
          <Ionicons name="time-outline" size={18} color={mode === 'timeline' ? colors.primary : colors.textSecondary} />
          <Text style={[styles.modeBtnText, mode === 'timeline' && styles.modeBtnTextActive]}>時間軸</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modeBtn, mode === 'map' && styles.modeBtnActive]}
          onPress={() => setMode('map')}
          accessibilityRole="button"
          accessibilityState={{ selected: mode === 'map' }}
          accessibilityLabel="地圖檢視"
        >
          <Ionicons name="map-outline" size={18} color={mode === 'map' ? colors.primary : colors.textSecondary} />
          <Text style={[styles.modeBtnText, mode === 'map' && styles.modeBtnTextActive]}>地圖</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <StateView type="skeleton" />
      ) : error ? (
        <StateView type="error" onRetry={() => { setLoading(true); loadAlbums() }} />
      ) : albums.length === 0 ? (
        <StateView
          type="empty"
          message="尚無拍攝歷程"
          subMessage="完成第一次拍攝後，這裡會記錄您的拍攝足跡"
          icon="camera-outline"
          actionLabel="立即預約拍攝"
          onAction={() => navigation.navigate('Booking')}
        />
      ) : mode === 'timeline' ? (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={{ paddingBottom: 24 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadAlbums() }} tintColor={colors.primary} />
          }
        >
          {years.length > 1 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.yearScroll}>
              {years.map(y => (
                <TouchableOpacity
                  key={y}
                  style={[styles.yearChip, selectedYear === y && styles.yearChipActive]}
                  onPress={() => setSelectedYear(y)}
                >
                  <Text style={[styles.yearChipText, selectedYear === y && styles.yearChipTextActive]}>{y}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
          <View style={styles.timelineSection}>
            <Text style={styles.yearHeader}>{selectedYear} 年 · {currentYearAlbums.length} 次拍攝</Text>
            {currentYearAlbums.length === 0 ? (
              <Text style={styles.emptyYearText}>今年尚無拍攝紀錄</Text>
            ) : (
              currentYearAlbums.map(renderTimelineItem)
            )}
          </View>
        </ScrollView>
      ) : (
        renderMapView()
      )}
    </SafeAreaView>
  )
}

const makeStyles = (colors: AppColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  modeSwitch: {
    flexDirection: 'row', backgroundColor: colors.surface,
    marginHorizontal: 16, marginTop: 12, marginBottom: 8, borderRadius: 12, padding: 4,
    ...shadows.sm,
  },
  modeBtn: {
    flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    paddingVertical: 10, borderRadius: 10, gap: 6,
  },
  modeBtnActive: { backgroundColor: colors.primaryLight },
  modeBtnText: { fontSize: 14, fontWeight: '600', color: colors.textSecondary },
  modeBtnTextActive: { color: colors.primary },
  scrollView: { flex: 1 },
  yearScroll: { paddingHorizontal: 16, paddingVertical: 8 },
  yearChip: {
    paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20,
    backgroundColor: colors.surface, marginRight: 8, borderWidth: 1, borderColor: colors.border,
  },
  yearChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  yearChipText: { fontSize: 14, fontWeight: '600', color: colors.textSecondary },
  yearChipTextActive: { color: colors.white },
  timelineSection: { paddingHorizontal: 16, paddingTop: 8 },
  yearHeader: { fontSize: 17, fontWeight: '800', color: colors.textPrimary, marginBottom: 16 },
  emptyYearText: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', paddingVertical: 32 },
  timelineCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface,
    borderRadius: 14, padding: 14, marginBottom: 10,
    ...shadows.sm,
  },
  timelineDate: { width: 56 },
  timelineDateText: { fontSize: 14, fontWeight: '700', color: colors.primary },
  timelineLine: { alignItems: 'center', marginRight: 12 },
  timelineDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary },
  timelineContent: { flex: 1 },
  timelineTitle: { fontSize: 15, fontWeight: '700', color: colors.textPrimary, marginBottom: 4 },
  timelineLocation: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  timelineLocationText: { fontSize: 13, color: colors.textSecondary },
  mapContainer: { flex: 1, marginHorizontal: 16, marginBottom: 16, borderRadius: 16, overflow: 'hidden' },
  map: { width: '100%', height: height * 0.55, borderRadius: 16 },
  mapEmptyOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, height: height * 0.55,
    justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.85)',
  },
  mapEmptyText: { fontSize: 16, fontWeight: '700', color: colors.textPrimary, marginTop: 12 },
  mapEmptySub: { fontSize: 13, color: colors.textSecondary, marginTop: 6, textAlign: 'center', paddingHorizontal: 32 },
  mapCarousel: { maxHeight: 72, marginTop: 12 },
  mapCarouselContent: { paddingRight: 8 },
  mapChip: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface,
    borderRadius: 24, paddingHorizontal: 14, paddingVertical: 10, marginRight: 10, gap: 6,
    ...shadows.sm, maxWidth: width * 0.55,
  },
  mapChipText: { fontSize: 13, fontWeight: '600', color: colors.textPrimary, flexShrink: 1 },
  mapChipDate: { fontSize: 12, color: colors.textSecondary },
  callout: { padding: 8, minWidth: 140 },
  calloutTitle: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  calloutDate: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  calloutAction: { fontSize: 12, color: colors.primary, marginTop: 6, fontWeight: '600' },
})
