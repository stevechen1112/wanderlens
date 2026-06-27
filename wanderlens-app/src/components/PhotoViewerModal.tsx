import React, { useEffect, useRef } from 'react'
import {
  Modal, View, Image, TouchableOpacity, Text, StyleSheet,
  Dimensions, ScrollView, Alert, Linking,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useColors, AppColors } from '@/theme'
import { albumApi } from '@/api'

const { width, height } = Dimensions.get('window')

interface Photo {
  id: number
  thumbnailUrl?: string
  previewUrl?: string
  fileUrl?: string
}

interface Props {
  visible: boolean
  photos: Photo[]
  index: number
  albumId: number
  onClose: () => void
  onIndexChange: (index: number) => void
}

export default function PhotoViewerModal({
  visible, photos, index, albumId, onClose, onIndexChange,
}: Props) {
  const scrollRef = useRef<ScrollView>(null)
  const colors = useColors()
  const styles = React.useMemo(() => makeStyles(colors), [colors])
  const photo = photos[index]

  useEffect(() => {
    if (!visible || !scrollRef.current) return
    scrollRef.current.scrollTo({ x: index * width, animated: true })
  }, [index, visible])

  if (!photo) return null

  const goPrev = () => { if (index > 0) onIndexChange(index - 1) }
  const goNext = () => { if (index < photos.length - 1) onIndexChange(index + 1) }

  const handleDownload = async () => {
    try {
      await albumApi.download(albumId, photo.id)
      const url = photo.fileUrl || photo.previewUrl
      if (url) {
        const can = await Linking.canOpenURL(url)
        if (can) await Linking.openURL(url)
        else Alert.alert('下載連結', url)
      } else {
        Alert.alert('提示', '此照片暫無下載連結')
      }
    } catch {
      Alert.alert('下載失敗', '請稍後再試')
    }
  }

  return (
    <Modal visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={onClose}
            style={styles.iconBtn}
            accessibilityRole="button"
            accessibilityLabel="關閉"
          >
            <Ionicons name="close" size={26} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.counter}>{index + 1} / {photos.length}</Text>
          <TouchableOpacity
            onPress={handleDownload}
            style={styles.iconBtn}
            accessibilityRole="button"
            accessibilityLabel="下載"
          >
            <Ionicons name="download-outline" size={24} color={colors.white} />
          </TouchableOpacity>
        </View>

        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) => {
            const next = Math.round(e.nativeEvent.contentOffset.x / width)
            if (next !== index) onIndexChange(next)
          }}
        >
          {photos.map((p) => (
            <View key={p.id} style={styles.slide}>
              <Image
                source={{ uri: p.previewUrl || p.fileUrl || p.thumbnailUrl }}
                style={styles.image}
                resizeMode="contain"
              />
            </View>
          ))}
        </ScrollView>

        <View style={styles.navRow}>
          <TouchableOpacity
            onPress={goPrev}
            disabled={index === 0}
            style={styles.navBtn}
            accessibilityRole="button"
            accessibilityLabel="上一張"
          >
            <Ionicons name="chevron-back" size={28} color={index === 0 ? colors.textSecondary : colors.white} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={goNext}
            disabled={index >= photos.length - 1}
            style={styles.navBtn}
            accessibilityRole="button"
            accessibilityLabel="下一張"
          >
            <Ionicons name="chevron-forward" size={28} color={index >= photos.length - 1 ? colors.textSecondary : colors.white} />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

const makeStyles = (colors: AppColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.black },
  topBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingTop: 48, paddingHorizontal: 12, paddingBottom: 8,
  },
  iconBtn: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },
  counter: { color: colors.white, fontSize: 15, fontWeight: '600' },
  slide: { width, height: height * 0.75, justifyContent: 'center', alignItems: 'center' },
  image: { width: width - 24, height: height * 0.7 },
  navRow: {
    position: 'absolute', bottom: 40, left: 0, right: 0,
    flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 24,
  },
  navBtn: { padding: 8 },
})
