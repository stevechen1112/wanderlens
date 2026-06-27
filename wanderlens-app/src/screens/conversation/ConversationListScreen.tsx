import React from 'react'
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useColors, type AppColors } from '@/theme'
import { conversationApi } from '@/api'
import { useNavigation } from '@react-navigation/native'
import ScreenHeader from '@/components/ScreenHeader'
import StateView from '@/components/StateView'
import { t } from '@/i18n'

export default function ConversationListScreen() {
  const colors = useColors()
  const styles = React.useMemo(() => makeStyles(colors), [colors])
  const [conversations, setConversations] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(false)
  const [refreshing, setRefreshing] = React.useState(false)
  const navigation = useNavigation<any>()

  const loadConversations = React.useCallback(async () => {
    setError(false)
    try {
      const res: any = await conversationApi.myConversations()
      setConversations(res.data || [])
    } catch {
      setError(true)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  React.useEffect(() => {
    loadConversations()
  }, [loadConversations])

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={() => navigation.navigate('ConversationRoom', { id: item.id })}
      accessibilityRole="button"
      accessibilityLabel={item.orderId ? `訂單 #${item.orderId} 對話` : '溝通室對話'}
    >
      <View style={[styles.avatar, item.status === 'OPEN' && styles.avatarOnline]}>
        <Ionicons name={item.orderId ? 'document-text' : 'chatbubbles'} size={20} color={colors.textSecondary} />
        {item.status === 'OPEN' && <View style={styles.onlineDot} />}
      </View>
      <View style={styles.info}>
        <View style={styles.topRow}>
          <Text style={styles.name} numberOfLines={1}>
            {item.orderId ? `訂單 #${item.orderId}` : '溝通室'}
          </Text>
          <Text style={styles.time}>{item.updatedAt ? formatTime(item.updatedAt) : ''}</Text>
        </View>
        <View style={styles.bottomRow}>
          <Text style={styles.preview} numberOfLines={1}>
            {item.lastMessage || '尚無訊息'}
          </Text>
          {item.unread > 0 ? (
            <View style={styles.badge}><Text style={styles.badgeText}>{item.unread > 9 ? '9+' : item.unread}</Text></View>
          ) : (
            <Text style={[styles.status, item.status === 'OPEN' ? styles.statusOpen : styles.statusClosed]}>
              {item.status === 'OPEN' ? '● 進行中' : '○ 已結束'}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader title={t('nav.conversations')} large />
      {loading ? (
        <StateView type="skeleton" />
      ) : error ? (
        <StateView type="error" onRetry={() => { setLoading(true); loadConversations() }} />
      ) : conversations.length === 0 ? (
        <StateView
          type="empty"
          message="尚無對話"
          subMessage="預約拍攝後，攝影師將透過訊息聯繫您確認拍攝細節與需求"
          icon="chatbubbles"
          actionLabel="立即預約拍攝"
          onAction={() => navigation.navigate('Booking')}
        />
      ) : (
        <FlatList
          data={conversations}
          renderItem={renderItem}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ padding: 16 }}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadConversations() }} tintColor={colors.primary} />
          }
        />
      )}
    </SafeAreaView>
  )
}

const formatTime = (d: string) => {
  try {
    const date = new Date(d)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    if (diff < 86400000) return date.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })
    return date.toLocaleDateString('zh-TW', { month: 'short', day: 'numeric' })
  } catch { return '' }
}

const makeStyles = (colors: AppColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  // 對話卡片
  card: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: colors.surface, borderRadius: 16, padding: 16,
  },
  avatar: {
    width: 52, height: 52, borderRadius: 16,
    backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center',
  },
  avatarOnline: {},
  onlineDot: {
    position: 'absolute', bottom: 0, right: 0,
    width: 14, height: 14, borderRadius: 7,
    backgroundColor: colors.success, borderWidth: 2, borderColor: colors.white,
  },
  info: { flex: 1 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  name: { fontSize: 16, fontWeight: '700', color: colors.textPrimary, flex: 1 },
  time: { fontSize: 12, color: colors.textSecondary, marginLeft: 8 },
  bottomRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  preview: { fontSize: 14, color: colors.textSecondary, flex: 1 },
  badge: {
    minWidth: 22, height: 22, borderRadius: 11,
    backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 6,
  },
  badgeText: { fontSize: 11, fontWeight: '700', color: colors.white },
  status: { fontSize: 12 },
  statusOpen: { color: colors.success },
  statusClosed: { color: colors.textSecondary },
})