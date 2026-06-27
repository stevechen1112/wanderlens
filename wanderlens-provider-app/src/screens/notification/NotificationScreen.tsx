import React, { useCallback, useState } from 'react'
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import ScreenHeader from '@/components/ScreenHeader'
import StateView from '@/components/StateView'
import { notifyApi, type NotificationItem } from '@/api'
import { useColors, type AppColors } from '@/theme'
import { radius, spacing } from '@/theme/spacing'
import { useLocale } from '@/i18n'
import { formatRelativeTime } from '@/utils/format'

export default function NotificationScreen({ navigation }: { navigation: any }) {
  const colors = useColors()
  const styles = React.useMemo(() => makeStyles(colors), [colors])
  const { t } = useLocale()
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  const load = useCallback(async () => {
    setError(false)
    try {
      const [listRes, unreadRes]: [{ data?: NotificationItem[] }, { data?: number }] = await Promise.all([
        notifyApi.getList(),
        notifyApi.getUnread(),
      ])
      setNotifications(listRes.data || [])
      setUnreadCount(unreadRes.data ?? 0)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  React.useEffect(() => { load() }, [load])

  const handleMarkRead = async (id: number) => {
    try {
      await notifyApi.markRead(id)
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)))
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch {
      // 不阻斷 UI
    }
  }

  const renderItem = ({ item }: { item: NotificationItem }) => (
    <TouchableOpacity
      style={[styles.card, !item.isRead && styles.cardUnread]}
      onPress={() => !item.isRead && handleMarkRead(item.id)}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel={item.message}
    >
      <View style={[styles.iconWrap, !item.isRead && styles.iconWrapUnread]}>
        <Ionicons
          name={item.isRead ? 'notifications-outline' : 'notifications'}
          size={20}
          color={item.isRead ? colors.textSecondary : colors.primary}
        />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.message, !item.isRead && styles.messageUnread]}>{item.message}</Text>
        <Text style={styles.time}>{formatRelativeTime(item.createdAt)}</Text>
      </View>
      {!item.isRead && <View style={styles.dot} />}
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader
        title={t('notification.center')}
        subtitle={unreadCount > 0 ? t('notification.unreadCount', { n: unreadCount }) : t('notification.allReadStatus')}
        onBack={() => navigation.goBack()}
      />

      {loading ? (
        <StateView type="skeleton" />
      ) : error ? (
        <StateView type="error" onRetry={() => { setLoading(true); load() }} />
      ) : notifications.length === 0 ? (
        <StateView type="empty" message={t('notification.noneYet')} icon="notifications-outline" />
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderItem}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load() }} colors={[colors.primary]} />}
        />
      )}
    </SafeAreaView>
  )
}

const makeStyles = (colors: AppColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  card: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.sm,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  cardUnread: { borderLeftWidth: 3, borderLeftColor: colors.primary },
  iconWrap: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: colors.background,
    justifyContent: 'center', alignItems: 'center',
  },
  iconWrapUnread: { backgroundColor: colors.primaryLight },
  message: { fontSize: 14, color: colors.textRegular, lineHeight: 20 },
  messageUnread: { fontWeight: '700', color: colors.textPrimary },
  time: { fontSize: 11, color: colors.textSecondary, marginTop: 4 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary },
})
