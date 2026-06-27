import React, { useState, useEffect, useCallback } from 'react'
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useColors, type AppColors } from '@/theme'
import { notifyApi } from '@/api'
import ScreenHeader from '@/components/ScreenHeader'
import StateView from '@/components/StateView'
import { useLocale } from '@/i18n'

interface NotificationItem {
  id: number
  message: string
  messageUrl?: string
  isRead: boolean
  createdAt: string
}

export default function NotificationScreen({ navigation }: { navigation: any }) {
  const colors = useColors()
  const styles = React.useMemo(() => makeStyles(colors), [colors])
  const { t } = useLocale()
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const [unreadCount, setUnreadCount] = useState(0)

  const loadNotifications = useCallback(async () => {
    setError('')
    try {
      const [listRes, unreadRes]: any[] = await Promise.all([
        notifyApi.getList(),
        notifyApi.getUnread(),
      ])
      setNotifications(listRes.data || [])
      setUnreadCount(unreadRes.data || 0)
    } catch (err: any) {
      setError(err?.message || t('common.error'))
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [t])

  useEffect(() => {
    loadNotifications()
  }, [loadNotifications])

  const onRefresh = () => {
    setRefreshing(true)
    loadNotifications()
  }

  const handleMarkRead = async (id: number) => {
    try {
      await notifyApi.markRead(id)
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch {
      // 標記已讀失敗不阻斷 UI
    }
  }

  const formatTime = (dateStr: string) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    if (minutes < 1) return t('notification.justNow')
    if (minutes < 60) return t('notification.minutesAgo', { n: minutes })
    if (hours < 24) return t('notification.hoursAgo', { n: hours })
    if (days < 7) return t('notification.daysAgo', { n: days })
    return date.toLocaleDateString()
  }

  const handlePress = async (item: NotificationItem) => {
    if (!item.isRead) {
      await handleMarkRead(item.id)
    }
    const url = item.messageUrl || ''
    const albumMatch = url.match(/wanderlens:\/\/album\/(\d+)/)
    if (albumMatch) {
      navigation.getParent()?.navigate('Albums', {
        screen: 'AlbumDetail',
        params: { albumId: Number(albumMatch[1]) },
      })
      return
    }
    if (/anniversary|寶寶|旅遊|回憶|週年/.test(item.message)) {
      navigation.navigate('ShootingHistory')
    }
  }

  const renderItem = ({ item }: { item: NotificationItem }) => (
    <TouchableOpacity
      style={[styles.notifCard, !item.isRead && styles.notifCardUnread]}
      onPress={() => handlePress(item)}
      accessibilityRole="button"
      accessibilityLabel={item.message}
    >
      <View style={styles.notifIcon}>
        <Ionicons
          name={item.isRead ? 'notifications-outline' : 'notifications'}
          size={20}
          color={item.isRead ? colors.textSecondary : colors.primary}
        />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.notifMessage, !item.isRead && styles.notifMessageUnread]}>
          {item.message}
        </Text>
        <Text style={styles.notifTime}>{formatTime(item.createdAt)}</Text>
      </View>
      {!item.isRead && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScreenHeader
        title={t('notification.title')}
        rightAction={
          unreadCount > 0 ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{t('notification.unread', { count: unreadCount })}</Text>
            </View>
          ) : undefined
        }
      />
      {loading ? (
        <StateView type="skeleton" />
      ) : error ? (
        <StateView type="error" message={error} onRetry={loadNotifications} />
      ) : notifications.length === 0 ? (
        <StateView
          type="empty"
          icon="notifications-off-outline"
          message={`${t('notification.empty')}\n${t('notification.emptyHint')}`}
        />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        />
      )}
    </SafeAreaView>
  )
}

const makeStyles = (colors: AppColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  badge: {
    backgroundColor: colors.primary + '20', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12,
  },
  badgeText: { fontSize: 12, color: colors.primary, fontWeight: '600' },
  notifCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface,
    borderRadius: 12, padding: 16, marginBottom: 8,
  },
  notifCardUnread: {
    backgroundColor: colors.primary + '08', borderWidth: 1, borderColor: colors.primary + '20',
  },
  notifIcon: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: colors.background,
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  notifMessage: { fontSize: 14, color: colors.textSecondary, lineHeight: 20 },
  notifMessageUnread: { color: colors.textPrimary, fontWeight: '500' },
  notifTime: { fontSize: 12, color: colors.textSecondary, marginTop: 4 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary, marginLeft: 8 },
})
