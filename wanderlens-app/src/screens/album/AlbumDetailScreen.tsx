import React, { useState, useEffect, useCallback } from 'react'
import {
  View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Dimensions, Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useColors, type AppColors } from '@/theme'
import { albumApi, retouchApi } from '@/api'
import { useAuthStore } from '@/stores/authStore'
import Button from '@/components/Button'
import StateView from '@/components/StateView'
import PhotoViewerModal from '@/components/PhotoViewerModal'
import AlbumConsentSheet from '@/components/AlbumConsentSheet'
import ShareSheet from '@/components/ShareSheet'
import { haptics } from '@/utils/haptics'
import { t } from '@/i18n'

const { width } = Dimensions.get('window')
const COLS = 3
const GAP = 4
const THUMB_SIZE = (width - GAP * (COLS + 1)) / COLS

export default function AlbumDetailScreen({ route }: { route: any }) {
  const colors = useColors()
  const styles = React.useMemo(() => makeStyles(colors), [colors])
  const albumId = route?.params?.id || route?.params?.albumId
  const { user } = useAuthStore()
  const [album, setAlbum] = useState<any>(null)
  const [photos, setPhotos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [selectedPhotos, setSelectedPhotos] = useState<Set<number>>(new Set())
  const [selectMode, setSelectMode] = useState(false)
  const [favorites, setFavorites] = useState<Set<number>>(new Set())
  const [viewerIndex, setViewerIndex] = useState(0)
  const [viewerOpen, setViewerOpen] = useState(false)
  const [consentOpen, setConsentOpen] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const [consentLevel, setConsentLevel] = useState('PRIVATE')
  const [hasMinor, setHasMinor] = useState(false)

  const loadData = useCallback(async () => {
    if (!albumId) return
    setError(false)
    try {
      const [albumRes, photosRes, favRes, consentRes]: any[] = await Promise.all([
        albumApi.getAlbum(albumId),
        albumApi.getPhotos(albumId),
        albumApi.getFavorites().catch(() => ({ data: [] })),
        albumApi.getConsent(albumId).catch(() => ({ data: null })),
      ])
      setAlbum(albumRes.data)
      setPhotos(photosRes.data || [])
      const consent = consentRes?.data
      if (consent?.consumerConsent) setConsentLevel(consent.consumerConsent)
      else if (albumRes.data?.albumType === 'PUBLIC') setConsentLevel('PUBLIC')
      if (consent?.hasMinor) setHasMinor(!!consent.hasMinor)
      const favIds: number[] = (favRes.data || [])
        .filter((f: any) => f.albumId === albumId || f.albumId == null)
        .map((f: any) => f.mediaAssetId ?? f.photoId ?? f.id)
        .filter((id: unknown) => typeof id === 'number')
      setFavorites(new Set(favIds))
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [albumId])

  useEffect(() => { loadData() }, [loadData])

  const toggleSelect = (photoId: number) => {
    const next = new Set(selectedPhotos)
    if (next.has(photoId)) next.delete(photoId)
    else next.add(photoId)
    setSelectedPhotos(next)
  }

  const toggleFavorite = async (photoId: number) => {
    if (!albumId) return
    const next = new Set(favorites)
    try {
      if (next.has(photoId)) {
        await albumApi.unfavorite(albumId, photoId)
        next.delete(photoId)
      } else {
        await albumApi.favorite(albumId, photoId)
        next.add(photoId)
      }
      setFavorites(next)
    } catch {
      Alert.alert('提示', '收藏操作失敗')
    }
  }

  const openPhoto = (index: number) => {
    if (selectMode) return
    setViewerIndex(index)
    setViewerOpen(true)
  }

  const submitRetouch = async () => {
    if (!user?.userId) { Alert.alert('請先登入'); return }
    if (!album?.orderId) { Alert.alert('無法取得訂單資訊'); return }
    if (selectedPhotos.size === 0) { Alert.alert('請至少選擇一張照片'); return }
    try {
      await retouchApi.createJob(album.orderId, user.userId, JSON.stringify([...selectedPhotos]))
      Alert.alert('精修申請已送出', `已選擇 ${selectedPhotos.size} 張照片進行精修`)
      setSelectMode(false)
      setSelectedPhotos(new Set())
    } catch {
      Alert.alert('精修申請失敗')
    }
  }

  const renderPhoto = ({ item, index }: { item: any; index: number }) => (
    <TouchableOpacity
      style={[styles.thumb, selectMode && selectedPhotos.has(item.id) && styles.thumbSelected]}
      onPress={() => selectMode ? toggleSelect(item.id) : openPhoto(index)}
      onLongPress={() => { setSelectMode(true); toggleSelect(item.id) }}
      accessibilityRole="imagebutton"
      accessibilityLabel={`照片 ${index + 1}`}
    >
      <Image source={{ uri: item.thumbnailUrl || item.previewUrl }} style={styles.thumbImage} />
      {selectMode && selectedPhotos.has(item.id) && (
        <View style={styles.selectBadge}><Text style={styles.selectBadgeText}>✓</Text></View>
      )}
      <TouchableOpacity
        style={styles.favBtn}
        onPress={() => { haptics.light(); toggleFavorite(item.id) }}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        accessibilityRole="button"
        accessibilityState={{ selected: favorites.has(item.id) }}
        accessibilityLabel={favorites.has(item.id) ? t('album.unfavorite') : t('album.favorite')}
      >
        <Ionicons
          name={favorites.has(item.id) ? 'heart' : 'heart-outline'}
          size={16}
          color={favorites.has(item.id) ? colors.danger : colors.white}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  )

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <StateView type="skeleton" />
      </SafeAreaView>
    )
  }

  if (error || !album) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <StateView type="error" onRetry={() => { setLoading(true); loadData() }} />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <Text style={styles.title}>{album.title}</Text>
        <Text style={styles.subtitle}>{album.shootDate} · {album.shootLocation}</Text>
        <View style={styles.actions}>
          <TouchableOpacity onPress={() => setShareOpen(true)} style={styles.actionBtn}>
            <Ionicons name="share-outline" size={16} color={colors.primary} />
            <Text style={styles.actionText}>{t('album.share')}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setConsentOpen(true)} style={styles.actionBtn}>
            <Ionicons name="shield-checkmark-outline" size={16} color={colors.primary} />
            <Text style={styles.actionText}>公開設定</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSelectMode(!selectMode)} style={styles.actionBtn}>
            <Ionicons name="color-wand-outline" size={16} color={colors.primary} />
            <Text style={styles.actionText}>
              {selectMode ? t('album.retouchCancel') : t('album.retouchSelect')}
            </Text>
          </TouchableOpacity>
        </View>
        {selectMode && selectedPhotos.size > 0 && (
          <Button
            label={t('album.retouchSubmit', { count: selectedPhotos.size })}
            onPress={submitRetouch}
            fullWidth
            style={styles.submitBtn}
          />
        )}
      </View>
      <FlatList
        data={photos}
        renderItem={renderPhoto}
        keyExtractor={(item) => String(item.id)}
        numColumns={COLS}
        contentContainerStyle={{ padding: GAP }}
        ListEmptyComponent={<StateView type="empty" message="尚無照片" icon="images-outline" />}
      />
      <PhotoViewerModal
        visible={viewerOpen}
        photos={photos}
        index={viewerIndex}
        albumId={albumId}
        onClose={() => setViewerOpen(false)}
        onIndexChange={setViewerIndex}
      />
      <AlbumConsentSheet
        visible={consentOpen}
        albumId={albumId}
        currentLevel={consentLevel}
        hasMinor={hasMinor}
        onClose={() => setConsentOpen(false)}
        onSaved={(level) => { setConsentLevel(level); loadData() }}
      />
      <ShareSheet
        visible={shareOpen}
        albumId={albumId}
        albumTitle={album.title}
        onClose={() => setShareOpen(false)}
      />
    </SafeAreaView>
  )
}

const makeStyles = (colors: AppColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { padding: 16, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border },
  title: { fontSize: 20, fontWeight: '700', color: colors.textPrimary },
  subtitle: { fontSize: 13, color: colors.textSecondary, marginTop: 4 },
  actions: { flexDirection: 'row', gap: 8, marginTop: 12 },
  actionBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 12, paddingVertical: 8, backgroundColor: colors.primaryLight, borderRadius: 20,
  },
  actionText: { fontSize: 13, color: colors.primary, fontWeight: '600' },
  submitBtn: { marginTop: 10 },
  thumb: { margin: GAP / 2, position: 'relative' },
  thumbSelected: { opacity: 0.75 },
  thumbImage: { width: THUMB_SIZE, height: THUMB_SIZE, borderRadius: 8 },
  selectBadge: {
    position: 'absolute', top: 4, right: 4, width: 22, height: 22, borderRadius: 11,
    backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center',
  },
  selectBadgeText: { color: colors.white, fontSize: 12, fontWeight: '700' },
  favBtn: {
    position: 'absolute', bottom: 4, right: 4, width: 28, height: 28, borderRadius: 14,
    backgroundColor: colors.overlay, justifyContent: 'center', alignItems: 'center',
  },
})
