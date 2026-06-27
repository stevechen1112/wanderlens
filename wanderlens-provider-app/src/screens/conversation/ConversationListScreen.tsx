import React from 'react'
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import ScreenHeader from '@/components/ScreenHeader'
import StateView from '@/components/StateView'
import { conversationApi, type Conversation } from '@/api'
import { useColors, type AppColors } from '@/theme'
import { radius, spacing } from '@/theme/spacing'
import { useLocale } from '@/i18n'
import { formatRelativeTime } from '@/utils/format'
import type { ConversationStackParamList } from '@/navigation/types'

type Nav = NativeStackNavigationProp<ConversationStackParamList, 'ConversationList'>

export default function ConversationListScreen() {
  const colors = useColors()
  const styles = React.useMemo(() => makeStyles(colors), [colors])
  const navigation = useNavigation<Nav>()
  const { t } = useLocale()
  const [conversations, setConversations] = React.useState<Conversation[]>([])
  const [loading, setLoading] = React.useState(true)
  const [refreshing, setRefreshing] = React.useState(false)
  const [error, setError] = React.useState(false)

  const load = React.useCallback(async () => {
    setError(false)
    try {
      const res: { data?: Conversation[] } = await conversationApi.list()
      setConversations(res.data || [])
    } catch {
      setError(true)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  React.useEffect(() => { load() }, [load])

  const renderItem = ({ item }: { item: Conversation }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() => navigation.navigate('ConversationRoom', {
        id: item.id,
        title: item.orderId ? t('conversation.orderTitle', { id: item.orderId }) : t('conversation.room'),
      })}
      accessibilityRole="button"
      accessibilityLabel={item.orderId ? t('conversation.orderTitle', { id: item.orderId }) : t('conversation.support')}
    >
      <View style={[styles.avatar, item.status === 'OPEN' && styles.avatarOpen]}>
        <Ionicons name={item.orderId ? 'document-text' : 'chatbubbles'} size={22} color={colors.primary} />
        {(item.unread ?? 0) > 0 && <View style={styles.unreadDot} />}
      </View>
      <View style={{ flex: 1 }}>
        <View style={styles.topRow}>
          <Text style={styles.title} numberOfLines={1}>
            {item.orderId ? t('conversation.orderTitle', { id: item.orderId }) : t('conversation.support')}
          </Text>
          <Text style={styles.time}>{formatRelativeTime(item.updatedAt)}</Text>
        </View>
        <View style={styles.bottomRow}>
          <Text style={styles.preview} numberOfLines={1}>{item.lastMessage || t('conversation.noLastMsg')}</Text>
          {(item.unread ?? 0) > 0 ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{(item.unread ?? 0) > 9 ? '9+' : item.unread}</Text>
            </View>
          ) : (
            <Text style={[styles.status, item.status === 'OPEN' ? styles.statusOpen : styles.statusClosed]}>
              {item.status === 'OPEN' ? t('conversation.statusOpen') : t('conversation.statusClosed')}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader title={t('conversation.title')} subtitle={t('conversation.listSubtitle')} large />

      {loading ? (
        <StateView type="skeleton" />
      ) : error ? (
        <StateView type="error" onRetry={() => { setLoading(true); load() }} />
      ) : conversations.length === 0 ? (
        <StateView
          type="empty"
          message={t('conversation.emptyTitle')}
          subMessage={t('conversation.emptySub')}
          icon="chatbubbles-outline"
        />
      ) : (
        <FlatList
          data={conversations}
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
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  avatar: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: colors.primaryLight,
    justifyContent: 'center', alignItems: 'center',
  },
  avatarOpen: { borderWidth: 2, borderColor: colors.success },
  unreadDot: {
    position: 'absolute', top: 0, right: 0, width: 12, height: 12,
    borderRadius: 6, backgroundColor: colors.danger, borderWidth: 2, borderColor: colors.white,
  },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 16, fontWeight: '700', color: colors.textPrimary, flex: 1, marginRight: spacing.sm },
  time: { fontSize: 11, color: colors.textSecondary },
  bottomRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  preview: { flex: 1, fontSize: 14, color: colors.textRegular },
  badge: {
    backgroundColor: colors.primary, minWidth: 20, height: 20, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center', paddingHorizontal: 6,
  },
  badgeText: { color: colors.white, fontSize: 11, fontWeight: '700' },
  status: { fontSize: 11, fontWeight: '600' },
  statusOpen: { color: colors.success },
  statusClosed: { color: colors.textSecondary },
})
