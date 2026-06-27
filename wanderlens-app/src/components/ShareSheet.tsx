import React, { useState } from 'react'
import {
  View, Text, Modal, TouchableOpacity, StyleSheet, Alert, Share, ActivityIndicator,
} from 'react-native'
import * as Clipboard from 'expo-clipboard'
import { Ionicons } from '@expo/vector-icons'
import { useColors, AppColors } from '@/theme'
import { albumApi } from '@/api'

const makePlatforms = (colors: AppColors) => [
  { id: 'line', label: 'LINE', icon: 'chatbubble-ellipses-outline' as const, color: '#06C755' },
  { id: 'facebook', label: 'Facebook', icon: 'logo-facebook' as const, color: '#1877F2' },
  { id: 'instagram', label: 'Instagram', icon: 'logo-instagram' as const, color: '#E4405F' },
  { id: 'copy', label: '複製連結', icon: 'link-outline' as const, color: colors.secondary },
  { id: 'native', label: '更多分享', icon: 'share-social-outline' as const, color: colors.primary },
]

interface Props {
  visible: boolean
  albumId: number
  albumTitle?: string
  onClose: () => void
}

export default function ShareSheet({ visible, albumId, albumTitle, onClose }: Props) {
  const [loading, setLoading] = useState<string | null>(null)
  const [privateLink, setPrivateLink] = useState<string | null>(null)
  const colors = useColors()
  const styles = React.useMemo(() => makeStyles(colors), [colors])
  const PLATFORMS = React.useMemo(() => makePlatforms(colors), [colors])

  const getPrivateLink = async () => {
    if (privateLink) return privateLink
    const res: any = await albumApi.share(albumId)
    const link = typeof res.data === 'string' ? res.data : res.data?.url
    if (link) setPrivateLink(link)
    return link
  }

  const handleShare = async (platform: string) => {
    setLoading(platform)
    try {
      if (platform === 'copy') {
        const link = await getPrivateLink()
        if (link) {
          await Clipboard.setStringAsync(link)
          Alert.alert('已複製', '私密分享連結已複製到剪貼簿')
        }
        return
      }
      if (platform === 'native') {
        const link = await getPrivateLink()
        if (link) {
          await Share.share({
            message: `${albumTitle || '我的 WanderLens 相簿'}\n${link}`,
            url: link,
          })
        }
        return
      }
      const res: any = await albumApi.socialShare(albumId, platform)
      const shareUrl = typeof res.data === 'string' ? res.data : res.data?.url
      if (shareUrl) {
        await Share.share({ message: shareUrl, url: shareUrl })
      }
    } catch {
      Alert.alert('分享失敗', '請稍後再試')
    } finally {
      setLoading(null)
    }
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} />
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.title}>分享相簿</Text>
          <Text style={styles.subtitle}>選擇分享方式或取得私密連結</Text>

          <View style={styles.grid}>
            {PLATFORMS.map(p => (
              <TouchableOpacity
                key={p.id}
                style={styles.platformBtn}
                onPress={() => handleShare(p.id)}
                activeOpacity={0.85}
                disabled={!!loading}
              >
                <View style={[styles.platformIcon, { backgroundColor: `${p.color}18` }]}>
                  {loading === p.id ? (
                    <ActivityIndicator size="small" color={p.color} />
                  ) : (
                    <Ionicons name={p.icon} size={26} color={p.color} />
                  )}
                </View>
                <Text style={styles.platformLabel}>{p.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
            <Text style={styles.cancelText}>取消</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

const makeStyles = (colors: AppColors) => StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: colors.overlay },
  sheet: {
    backgroundColor: colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingHorizontal: 24, paddingBottom: 32, paddingTop: 8,
  },
  handle: {
    width: 40, height: 4, borderRadius: 2, backgroundColor: colors.border,
    alignSelf: 'center', marginBottom: 16,
  },
  title: { fontSize: 20, fontWeight: '700', color: colors.textPrimary, textAlign: 'center' },
  subtitle: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', marginTop: 6, marginBottom: 24 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 20 },
  platformBtn: { width: 72, alignItems: 'center' },
  platformIcon: {
    width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center',
    marginBottom: 8,
  },
  platformLabel: { fontSize: 12, fontWeight: '600', color: colors.textRegular, textAlign: 'center' },
  cancelBtn: {
    marginTop: 28, paddingVertical: 14, borderRadius: 12, backgroundColor: colors.background,
  },
  cancelText: { fontSize: 16, fontWeight: '600', color: colors.textSecondary, textAlign: 'center' },
})
