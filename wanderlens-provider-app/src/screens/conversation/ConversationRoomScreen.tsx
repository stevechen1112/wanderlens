import React from 'react'
import {
  View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet,
  KeyboardAvoidingView, Platform, Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Image } from 'expo-image'
import * as ImagePicker from 'expo-image-picker'
import ScreenHeader from '@/components/ScreenHeader'
import StateView from '@/components/StateView'
import { conversationApi, type Message } from '@/api'
import { useAuthStore } from '@/stores/authStore'
import { useConversationStream } from '@/hooks/useConversationStream'
import { useColors, type AppColors } from '@/theme'
import { radius, spacing } from '@/theme/spacing'
import { useLocale } from '@/i18n'
import { haptics } from '@/utils/haptics'
import { formatDate, formatTime } from '@/utils/format'

export default function ConversationRoomScreen() {
  const colors = useColors()
  const styles = React.useMemo(() => makeStyles(colors), [colors])
  const route = useRoute<any>()
  const navigation = useNavigation()
  const { t } = useLocale()
  const conversationId = route.params?.id as number
  const title = route.params?.title as string | undefined
  const { user } = useAuthStore()
  const userId = user?.userId ?? 0

  const [messages, setMessages] = React.useState<Message[]>([])
  const [input, setInput] = React.useState('')
  const [sending, setSending] = React.useState(false)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(false)
  const [conversationStatus, setConversationStatus] = React.useState<string>('OPEN')
  const [participants, setParticipants] = React.useState<any[]>([])
  const flatListRef = React.useRef<FlatList>(null)

  const isReadonly = conversationStatus === 'READONLY' || conversationStatus === 'CLOSED'

  // senderId → userType 映射
  const senderTypeMap = React.useMemo(() => {
    const map: Record<number, string> = {}
    for (const p of participants) {
      map[p.userId] = p.userType
    }
    return map
  }, [participants])

  const senderLabel = (senderId: number) => {
    if (senderId === 0) return ''
    const type = senderTypeMap[senderId]
    if (type === 'CONSUMER') return t('conversation.consumer')
    if (type === 'PHOTOGRAPHER') return t('conversation.photographer')
    if (type === 'STYLIST') return t('conversation.stylist')
    if (type === 'ADMIN') return t('conversation.admin')
    return ''
  }

  const loadMessages = React.useCallback(async (options?: { background?: boolean }) => {
    try {
      const res: { data?: Message[] } = await conversationApi.getMessages(conversationId)
      setMessages(res.data || [])
      setError(false)
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: false }), 100)
    } catch {
      // 僅在主要載入（非背景輪詢/串流刷新）時呈現錯誤狀態
      if (!options?.background) setError(true)
    } finally {
      setLoading(false)
    }
  }, [conversationId])

  React.useEffect(() => {
    loadMessages()
    conversationApi.markAsRead(conversationId).catch(() => {})
    // 載入對話狀態
    conversationApi.getConversation(conversationId).then((res: any) => {
      if (res?.data?.status) setConversationStatus(res.data.status)
    }).catch(() => {})
    // 載入參與者列表
    conversationApi.getParticipants(conversationId).then((res: any) => {
      setParticipants(res.data || [])
    }).catch(() => {})
  }, [conversationId, loadMessages])

  useConversationStream(conversationId, (payload) => {
    if (payload && typeof payload === 'object' && (payload as { type?: string }).type === 'poll') {
      loadMessages({ background: true })
      return
    }
    loadMessages({ background: true })
  })

  const send = async () => {
    if (!input.trim() || sending) return
    const pending = input.trim()
    setSending(true)
    try {
      await conversationApi.sendMessage(conversationId, pending)
      haptics.light()
      setInput('')
      await loadMessages({ background: true })
    } catch {
      Alert.alert(t('conversation.sendFailed'), t('conversation.sendFailedDesc'))
    } finally {
      setSending(false)
    }
  }

  const pickAndSendImage = async () => {
    if (sending) return
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (!perm.granted) {
      Alert.alert(t('conversation.permTitle'), t('conversation.permDesc'))
      return
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    })
    if (result.canceled || !result.assets?.length) return
    const asset = result.assets[0]
    setSending(true)
    try {
      const formData = new FormData()
      formData.append('file', {
        uri: asset.uri,
        name: asset.fileName || `image_${Date.now()}.jpg`,
        type: asset.mimeType || 'image/jpeg',
      } as unknown as Blob)
      await conversationApi.uploadImage(conversationId, formData)
      haptics.light()
      await loadMessages({ background: true })
    } catch {
      Alert.alert(t('conversation.uploadFailed'), t('conversation.uploadFailedDesc'))
    } finally {
      setSending(false)
    }
  }

  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    if (item.messageType === 'SYSTEM') {
      return (
        <View style={styles.systemMsg}>
          <Text style={styles.systemText}>{item.content}</Text>
        </View>
      )
    }

    const isMine = item.senderId === userId
    const showDate = index > 0
      && messages[index - 1]?.createdAt?.split('T')[0] !== item.createdAt?.split('T')[0]
    const imageUri = item.imageUrl || (item.messageType === 'IMAGE' ? item.content : undefined)
    const isImage = !!imageUri
    const label = senderLabel(item.senderId)
    const showSenderLabel = !isMine && label

    return (
      <View>
        {showDate && (
          <View style={styles.dateSep}>
            <Text style={styles.dateText}>{formatDate(item.createdAt)}</Text>
          </View>
        )}
        <View style={[styles.msgRow, isMine ? styles.msgMine : styles.msgOther]}>
          {isImage ? (
            <Image
              source={{ uri: imageUri }}
              style={styles.msgImage}
              contentFit="cover"
              transition={200}
              accessibilityLabel={t('conversation.image')}
            />
          ) : (
            <View style={[styles.bubble, isMine ? styles.bubbleMine : styles.bubbleOther]}>
              {showSenderLabel ? (
                <Text style={styles.senderLabel}>{label}</Text>
              ) : null}
              <Text style={[styles.msgText, isMine && styles.msgTextMine]}>
                {item.content || t('conversation.image')}
              </Text>
            </View>
          )}
          <Text style={styles.msgTime}>{formatTime(item.createdAt)}</Text>
        </View>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScreenHeader title={title || t('conversation.chat')} onBack={() => navigation.goBack()} />
      {loading ? (
        <StateView type="skeleton" />
      ) : error ? (
        <StateView type="error" message={t('conversation.loadFailed')} onRetry={() => { setLoading(true); loadMessages() }} />
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item, idx) => String(item.id || idx)}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyChat}>
              <Ionicons name="chatbubbles-outline" size={48} color={colors.textSecondary} />
              <Text style={styles.emptyText}>{t('conversation.startChat')}</Text>
            </View>
          }
        />
      )}
      {isReadonly ? (
        <View style={styles.readonlyBanner}>
          <Ionicons name="lock-closed-outline" size={16} color={colors.warning} />
          <Text style={styles.readonlyText}>{t('conversation.readonly')}</Text>
        </View>
      ) : (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.inputBar}>
            <View style={styles.inputWrap}>
              <TouchableOpacity
                style={styles.imageBtn}
                onPress={pickAndSendImage}
                disabled={sending}
                accessibilityRole="button"
                accessibilityLabel={t('conversation.sendImage')}
                accessibilityState={{ disabled: sending }}
              >
                <Ionicons name="image-outline" size={22} color={colors.textSecondary} />
              </TouchableOpacity>
              <TextInput
                style={styles.input}
                value={input}
                onChangeText={setInput}
                placeholder={t('conversation.placeholder')}
                placeholderTextColor={colors.textSecondary}
                multiline
                maxLength={500}
              />
              <TouchableOpacity
                style={[styles.sendBtn, (!input.trim() || sending) && styles.sendBtnDisabled]}
                onPress={send}
                disabled={!input.trim() || sending}
                accessibilityRole="button"
                accessibilityLabel={t('conversation.send')}
                accessibilityState={{ disabled: !input.trim() || sending }}
              >
                <Ionicons name="send" size={18} color={colors.white} />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  )
}

const makeStyles = (colors: AppColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  readonlyBanner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: spacing.md, backgroundColor: colors.warningLight },
  readonlyText: { fontSize: 13, color: colors.warning, fontWeight: '600' },
  senderLabel: { fontSize: 11, fontWeight: '700', color: colors.primary, marginBottom: 2 },
  listContent: { padding: spacing.md, paddingBottom: spacing.sm },
  emptyChat: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 120 },
  emptyText: { fontSize: 15, color: colors.textSecondary, marginTop: spacing.md },
  systemMsg: { alignItems: 'center', marginVertical: spacing.sm },
  systemText: {
    fontSize: 12, color: colors.textSecondary, backgroundColor: 'rgba(0,0,0,0.06)',
    paddingHorizontal: 14, paddingVertical: 4, borderRadius: radius.full,
  },
  dateSep: { alignItems: 'center', marginVertical: spacing.md },
  dateText: {
    fontSize: 12, color: colors.textSecondary, backgroundColor: colors.surface,
    paddingHorizontal: 14, paddingVertical: 4, borderRadius: radius.full,
  },
  msgRow: { marginBottom: 4, paddingHorizontal: 4 },
  msgMine: { alignItems: 'flex-end' },
  msgOther: { alignItems: 'flex-start' },
  bubble: { maxWidth: '78%', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 20 },
  bubbleMine: { backgroundColor: colors.primary, borderBottomRightRadius: 4 },
  bubbleOther: { backgroundColor: colors.surface, borderBottomLeftRadius: 4 },
  msgText: { fontSize: 15, lineHeight: 21, color: colors.textPrimary },
  msgTextMine: { color: colors.white },
  msgImage: { width: 200, height: 200, borderRadius: 16, backgroundColor: colors.border },
  msgTime: { fontSize: 11, color: colors.textSecondary, marginTop: 2, paddingHorizontal: 4 },
  inputBar: { padding: spacing.md, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border },
  inputWrap: {
    flexDirection: 'row', alignItems: 'flex-end', backgroundColor: colors.background,
    borderRadius: radius.full, paddingLeft: spacing.lg, paddingRight: 4, paddingVertical: 2,
  },
  input: { flex: 1, fontSize: 15, paddingVertical: spacing.sm, maxHeight: 100, color: colors.textPrimary },
  imageBtn: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginRight: 4, alignSelf: 'flex-end', marginBottom: 2 },
  sendBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary,
    justifyContent: 'center', alignItems: 'center', marginLeft: 4,
  },
  sendBtnDisabled: { opacity: 0.4 },
})
