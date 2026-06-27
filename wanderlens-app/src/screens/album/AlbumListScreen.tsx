import React, { useCallback, useState } from 'react'
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { shadows, useColors, type AppColors } from '@/theme'
import { albumApi } from '@/api'
import { useNavigation } from '@react-navigation/native'
import ScreenHeader from '@/components/ScreenHeader'
import StateView from '@/components/StateView'
import { t } from '@/i18n'

export default function AlbumListScreen() {
  const colors = useColors()
  const styles = React.useMemo(() => makeStyles(colors), [colors])
  const [albums, setAlbums] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const navigation = useNavigation<any>()

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

  React.useEffect(() => { loadAlbums() }, [loadAlbums])

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() => navigation.navigate('AlbumDetail', { id: item.id })}
      accessibilityRole="button"
      accessibilityLabel={item.title}
    >
      {item.coverUrl ? (
        <Image source={{ uri: item.coverUrl }} style={styles.cover} />
      ) : (
        <View style={[styles.cover, styles.coverPlaceholder]}>
          <Ionicons name="images-outline" size={40} color={colors.textSecondary} />
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.shootDate} · {item.shootLocation}</Text>
      </View>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader title={t('album.myAlbums')} large />
      {loading ? (
        <StateView type="loading" />
      ) : error ? (
        <StateView type="error" onRetry={() => { setLoading(true); loadAlbums() }} />
      ) : albums.length === 0 ? (
        <StateView
          type="empty"
          message={t('album.empty')}
          subMessage="完成拍攝後，您的相簿將顯示在這裡"
          icon="camera-outline"
          actionLabel="立即預約拍攝"
          onAction={() => navigation.navigate('Booking')}
        />
      ) : (
        <FlatList
          data={albums}
          renderItem={renderItem}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ padding: 16 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadAlbums() }} tintColor={colors.primary} />
          }
        />
      )}
    </SafeAreaView>
  )
}

const makeStyles = (colors: AppColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  card: {
    backgroundColor: colors.surface, borderRadius: 16, marginBottom: 14, overflow: 'hidden',
    ...shadows.sm,
  },
  cover: { width: '100%', height: 180 },
  coverPlaceholder: { backgroundColor: colors.border, justifyContent: 'center', alignItems: 'center' },
  info: { padding: 14 },
  title: { fontSize: 17, fontWeight: '700', color: colors.textPrimary },
  subtitle: { fontSize: 13, color: colors.textSecondary, marginTop: 4 },
})
