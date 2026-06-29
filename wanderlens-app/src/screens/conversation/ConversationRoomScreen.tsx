import React from 'react'
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform, Modal, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import * as ImagePicker from 'expo-image-picker'
import { useColors, type AppColors } from '@/theme'
import { conversationApi } from '@/api'
import { haptics } from '@/utils/haptics'
import * as secureStorage from '@/utils/secureStorage'
import { t } from '@/i18n'

const getImageUri = (item: any): string | undefined => {
  if (item?.imageUrl) return item.imageUrl
  if (item?.messageType === 'IMAGE') return item.content || undefined
  return undefined
}

export default function ConversationRoomScreen({ route }: { route: any }) {
  const colors = useColors()
  const styles = React.useMemo(() => makeStyles(colors), [colors])
  const conversationId = route?.params?.id
  const [messages, setMessages] = React.useState<any[]>([])
  const [input, setInput] = React.useState('')
  const [userId, setUserId] = React.useState<number>(0)
  const [sending, setSending] = React.useState(false)
  const [viewerUri, setViewerUri] = React.useState<string | null>(null)
  const [conversationStatus, setConversationStatus] = React.useState<string>('OPEN')
  const [participants, setParticipants] = React.useState<any[]>([])
  const flatListRef = React.useRef<FlatList>(null)
  const lastCountRef = React.useRef<number>(-1)

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

  React.useEffect(() => {
    secureStorage.getItemAsync('wl_user_id').then((val) => { if (val) setUserId(Number(val)) })
    // 載入對話狀態
    conversationApi.getConversation(conversationId).then((res: any) => {
      if (res?.data?.status) setConversationStatus(res.data.status)
    }).catch(() => {})
    // 載入參與者列表
    conversationApi.getParticipants(conversationId).then((res: any) => {
      setParticipants(res.data || [])
    }).catch(() => {})
    loadMessages()
    const interval = setInterval(loadMessages, 10000)
    return () => clearInterval(interval)
  }, [])

  const markRead = () => {
    // 背景標記已讀，失敗 silent，不阻斷流程
    conversationApi.markAsRead(conversationId).catch(() => {})
  }

  const loadMessages = async () => {
    try {
      const res: any = await conversationApi.getMessages(conversationId)
      const data = res.data || []
      setMessages(data)
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: false }), 100)
      // 進入房間（首次）或收到新訊息（數量變動）後標記已讀
      if (data.length !== lastCountRef.current) {
        lastCountRef.current = data.length
        markRead()
      }
    } catch { /* silent */ }
  }

  const send = async () => {
    if (!input.trim() || sending) return
    setSending(true)
    try {
      await conversationApi.sendMessage(conversationId, input)
      setInput('')
      loadMessages()
    } catch {
      haptics.error()
    }
    finally { setSending(false) }
  }

  const pickAndSendImage = async () => {
    if (sending) return
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (!perm.granted) {
      Alert.alert('權限不足', '請於系統設定允許存取相片，才能傳送圖片')
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
      const name = asset.fileName || `chat_${Date.now()}.jpg`
      const type = asset.mimeType || 'image/jpeg'
      formData.append('file', { uri: asset.uri, name, type } as any)
      await conversationApi.uploadImage(conversationId, formData)
      haptics.light()
      loadMessages()
    } catch {
      Alert.alert('傳送失敗', '圖片傳送失敗，請稍後再試')
    } finally {
      setSending(false)
    }
  }

  const renderMessage = ({ item, index }: { item: any; index: number }) => {
    if (item.messageType === 'SYSTEM') {
      return (
        <View style={styles.systemMsg}>
          <Text style={styles.systemText}>{item.content}</Text>
        </View>
      )
    }

    const isMine = item.senderId === userId
    const showDate = index > 0 && messages[index - 1]?.createdAt?.split('T')[0] !== item.createdAt?.split('T')[0]
    const imageUri = getImageUri(item)
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
          {imageUri ? (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setViewerUri(imageUri)}
              accessibilityRole="imagebutton"
              accessibilityLabel="查看圖片"
            >
              <Image source={{ uri: imageUri }} style={styles.msgImage} contentFit="cover" transition={150} />
            </TouchableOpacity>
          ) : (
            <View style={[styles.bubble, isMine ? styles.bubbleMine : styles.bubbleOther]}>
              {showSenderLabel ? (
                <Text style={styles.senderLabel}>{label}</Text>
              ) : null}
              <Text style={[styles.msgText, isMine && styles.msgTextMine]}>
                {item.content}
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
      {isReadonly && (
        <View style={styles.readonlyBanner}>
          <Ionicons name="lock-closed-outline" size={16} color={colors.warning} />
          <Text style={styles.readonlyText}>訂單已結案，對話為唯讀模式</Text>
        </View>
      )}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item, idx) => String(item.id || idx)}
        contentContainerStyle={{ padding: 12, paddingBottom: 8 }}
        ListEmptyComponent={
          <View style={styles.emptyChat}>
            <Ionicons name="chatbubbles-outline" size={48} color={colors.textSecondary} />
            <Text style={styles.emptyText}>尚無訊息，開始對話吧</Text>
          </View>
        }
      />
      {!isReadonly && (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.inputBar}>
            <TouchableOpacity
              style={styles.imageBtn}
              onPress={pickAndSendImage}
              disabled={sending}
              accessibilityRole="button"
              accessibilityLabel="傳送圖片"
            >
              <Ionicons name="image-outline" size={24} color={sending ? colors.textSecondary : colors.primary} />
            </TouchableOpacity>
            <View style={styles.inputWrap}>
              <TextInput
                style={styles.input}
                value={input}
                onChangeText={setInput}
                placeholder="輸入訊息..."
                placeholderTextColor={colors.textSecondary}
                multiline
                maxLength={500}
              />
              <TouchableOpacity
                style={[styles.sendBtn, (!input.trim() || sending) && styles.sendBtnDisabled]}
                onPress={send}
                disabled={!input.trim() || sending}
                accessibilityRole="button"
                accessibilityLabel="傳送訊息"
              >
                <Ionicons name="send" size={18} color={colors.white} />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      )}

      <Modal visible={!!viewerUri} transparent animationType="fade" onRequestClose={() => setViewerUri(null)}>
        <View style={styles.viewerContainer}>
          <TouchableOpacity
            style={styles.viewerClose}
            onPress={() => setViewerUri(null)}
            accessibilityRole="button"
            accessibilityLabel="關閉"
          >
            <Ionicons name="close" size={28} color={colors.white} />
          </TouchableOpacity>
          {viewerUri && (
            <Image source={{ uri: viewerUri }} style={styles.viewerImage} contentFit="contain" />
          )}
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const formatTime = (d: string) => {
  try { return new Date(d).toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' }) }
  catch { return '' }
}
const formatDate = (d: string) => {
  try { return new Date(d).toLocaleDateString('zh-TW', { month: 'long', day: 'numeric', weekday: 'short' }) }
  catch { return '' }
}

const makeStyles = (colors: AppColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  readonlyBanner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 8, backgroundColor: colors.warningLight },
  readonlyText: { fontSize: 13, color: colors.warning, fontWeight: '600' },
  senderLabel: { fontSize: 11, fontWeight: '700', color: colors.primary, marginBottom: 2 },
  emptyChat: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 120 },
  emptyText: { fontSize: 15, color: colors.textSecondary, marginTop: 12 },
  systemMsg: { alignItems: 'center', marginVertical: 8 },
  systemText: { fontSize: 12, color: colors.textSecondary, backgroundColor: 'rgba(0,0,0,0.05)', paddingHorizontal: 14, paddingVertical: 4, borderRadius: 12, overflow: 'hidden' },
  dateSep: { alignItems: 'center', marginVertical: 12 },
  dateText: { fontSize: 12, color: colors.textSecondary, backgroundColor: colors.surface, paddingHorizontal: 14, paddingVertical: 4, borderRadius: 12, overflow: 'hidden' },
  msgRow: { marginBottom: 4, paddingHorizontal: 4 },
  msgMine: { alignItems: 'flex-end' },
  msgOther: { alignItems: 'flex-start' },
  bubble: { maxWidth: '75%', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 20 },
  bubbleMine: { backgroundColor: colors.primary, borderBottomRightRadius: 4 },
  bubbleOther: { backgroundColor: colors.surface, borderBottomLeftRadius: 4 },
  msgText: { fontSize: 15, lineHeight: 21, color: colors.textPrimary },
  msgTextMine: { color: colors.white },
  msgImage: { width: 200, height: 200, borderRadius: 16, backgroundColor: colors.surface },
  msgTime: { fontSize: 11, color: colors.textSecondary, marginTop: 2, paddingHorizontal: 4 },
  inputBar: { flexDirection: 'row', alignItems: 'flex-end', padding: 10, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border },
  imageBtn: { width: 38, height: 38, borderRadius: 19, justifyContent: 'center', alignItems: 'center', marginRight: 4, marginBottom: 1 },
  inputWrap: { flex: 1, flexDirection: 'row', alignItems: 'flex-end', backgroundColor: colors.background, borderRadius: 24, paddingLeft: 16, paddingRight: 4, paddingVertical: 2 },
  input: { flex: 1, fontSize: 15, paddingVertical: 8, maxHeight: 100, color: colors.textPrimary },
  sendBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', marginLeft: 4 },
  sendBtnDisabled: { opacity: 0.4 },
  viewerContainer: { flex: 1, backgroundColor: colors.black, justifyContent: 'center', alignItems: 'center' },
  viewerClose: { position: 'absolute', top: 48, right: 16, width: 44, height: 44, justifyContent: 'center', alignItems: 'center', zIndex: 2 },
  viewerImage: { width: '100%', height: '80%' },
})
