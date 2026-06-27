import React, { useState } from 'react'
import {
  View, Text, Modal, TouchableOpacity, StyleSheet, Switch, ScrollView, Alert,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useColors, AppColors } from '@/theme'
import Button from '@/components/Button'
import { albumApi } from '@/api'

type ConsentLevel = 'PRIVATE' | 'PUBLIC' | 'MARKETING' | 'COMMERCIAL'

const CONSUMER_LEVELS: { value: ConsentLevel; label: string; desc: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { value: 'PRIVATE', label: '完全私密', desc: '僅您與攝影師可見', icon: 'lock-closed-outline' },
  { value: 'PUBLIC', label: '公開展示', desc: '可出現在平台精選作品', icon: 'eye-outline' },
  { value: 'MARKETING', label: '行銷授權', desc: '平台可用於行銷宣傳', icon: 'megaphone-outline' },
  { value: 'COMMERCIAL', label: '商業授權', desc: '可用於商業合作與廣告', icon: 'briefcase-outline' },
]

interface Props {
  visible: boolean
  albumId: number
  currentLevel?: string
  hasMinor?: boolean
  onClose: () => void
  onSaved: (level: string) => void
}

export default function AlbumConsentSheet({
  visible, albumId, currentLevel = 'PRIVATE', hasMinor: initialHasMinor = false, onClose, onSaved,
}: Props) {
  const [level, setLevel] = useState<ConsentLevel>((currentLevel as ConsentLevel) || 'PRIVATE')
  const [hasMinor, setHasMinor] = useState(initialHasMinor)
  const [saving, setSaving] = useState(false)
  const colors = useColors()
  const styles = React.useMemo(() => makeStyles(colors), [colors])

  const save = async () => {
    setSaving(true)
    try {
      await albumApi.setMultiLevelConsent(albumId, level, undefined, hasMinor)
      onSaved(level)
      onClose()
      Alert.alert('已更新', '公開設定已儲存')
    } catch {
      Alert.alert('儲存失敗', '請稍後再試')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <View style={styles.header}>
            <Text style={styles.title}>公開設定</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
              <Ionicons name="close" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>選擇您願意授權的公開範圍。您可隨時調整或撤回。</Text>

          <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
            {CONSUMER_LEVELS.map(item => {
              const selected = level === item.value
              const disabled = hasMinor && (item.value === 'MARKETING' || item.value === 'COMMERCIAL')
              return (
                <TouchableOpacity
                  key={item.value}
                  style={[styles.option, selected && styles.optionSelected, disabled && styles.optionDisabled]}
                  onPress={() => !disabled && setLevel(item.value)}
                  activeOpacity={0.85}
                  disabled={disabled}
                >
                  <View style={[styles.optionIcon, selected && styles.optionIconSelected]}>
                    <Ionicons name={item.icon} size={22} color={selected ? colors.primary : colors.textSecondary} />
                  </View>
                  <View style={styles.optionBody}>
                    <Text style={[styles.optionLabel, selected && styles.optionLabelSelected]}>{item.label}</Text>
                    <Text style={styles.optionDesc}>{item.desc}</Text>
                    {disabled && <Text style={styles.optionWarn}>含未成年人時不可選</Text>}
                  </View>
                  {selected && <Ionicons name="checkmark-circle" size={22} color={colors.primary} />}
                </TouchableOpacity>
              )
            })}

            <View style={styles.minorRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.minorLabel}>拍攝對象含未成年人</Text>
                <Text style={styles.minorDesc}>開啟後授權上限將自動限制</Text>
              </View>
              <Switch
                value={hasMinor}
                onValueChange={(v) => {
                  setHasMinor(v)
                  if (v && (level === 'MARKETING' || level === 'COMMERCIAL')) {
                    setLevel('PUBLIC')
                  }
                }}
                trackColor={{ false: colors.border, true: colors.primaryLight }}
                thumbColor={hasMinor ? colors.primary : colors.white}
              />
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <Button label="儲存設定" onPress={save} loading={saving} />
          </View>
        </View>
      </View>
    </Modal>
  )
}

const makeStyles = (colors: AppColors) => StyleSheet.create({
  overlay: { flex: 1, backgroundColor: colors.overlay, justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24,
    maxHeight: '85%', paddingBottom: 24,
  },
  handle: {
    width: 40, height: 4, borderRadius: 2, backgroundColor: colors.border,
    alignSelf: 'center', marginTop: 10, marginBottom: 8,
  },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingBottom: 8,
  },
  title: { fontSize: 20, fontWeight: '700', color: colors.textPrimary },
  subtitle: { fontSize: 14, color: colors.textSecondary, paddingHorizontal: 20, lineHeight: 20, marginBottom: 12 },
  list: { paddingHorizontal: 16 },
  option: {
    flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 14,
    borderWidth: 1.5, borderColor: colors.border, marginBottom: 10, backgroundColor: colors.surface,
  },
  optionSelected: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  optionDisabled: { opacity: 0.45 },
  optionIcon: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: colors.background,
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  optionIconSelected: { backgroundColor: colors.surface },
  optionBody: { flex: 1 },
  optionLabel: { fontSize: 16, fontWeight: '600', color: colors.textPrimary },
  optionLabelSelected: { color: colors.primaryDark },
  optionDesc: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  optionWarn: { fontSize: 12, color: colors.warning, marginTop: 4 },
  minorRow: {
    flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 14,
    backgroundColor: colors.background, marginTop: 4, marginBottom: 8,
  },
  minorLabel: { fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  minorDesc: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  footer: { paddingHorizontal: 20, paddingTop: 8 },
})
