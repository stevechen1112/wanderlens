import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import ScreenHeader from '@/components/ScreenHeader'
import Button from '@/components/Button'
import { providerApi } from '@/api'
import { useAuthStore } from '@/stores/authStore'
import { useColors, type AppColors } from '@/theme'
import { radius, spacing } from '@/theme/spacing'
import { useLocale } from '@/i18n'

interface WorkRow { id: number; imageUrl?: string }

export default function WorksScreen({ navigation }: { navigation: any }) {
  const colors = useColors()
  const styles = useMemo(() => makeStyles(colors), [colors])
  const { t } = useLocale()
  const { providerId } = useAuthStore()
  const [works, setWorks] = useState<WorkRow[]>([])
  const [uploading, setUploading] = useState(false)

  const load = useCallback(async () => {
    if (!providerId) return
    try {
      const res: any = await providerApi.getWorks(providerId)
      setWorks(res.data || [])
    } catch {
      Alert.alert(t('common.errorTitle'), t('account.loadFailed'))
    }
  }, [providerId, t])

  useEffect(() => { load() }, [load])

  const upload = async () => {
    if (!providerId) return
    if (works.length >= 50) {
      Alert.alert(t('account.maxWorks'))
      return
    }
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (!perm.granted) return
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.85,
    })
    if (result.canceled || !result.assets?.[0]) return

    setUploading(true)
    try {
      const asset = result.assets[0]
      const formData = new FormData()
      formData.append('file', {
        uri: asset.uri,
        name: asset.fileName || 'work.jpg',
        type: asset.mimeType || 'image/jpeg',
      } as unknown as Blob)
      const uploadRes: any = await providerApi.uploadFile('provider_works', formData)
      const fileUuid = uploadRes.data?.uuid
      if (!fileUuid) throw new Error('missing uuid')
      await providerApi.addWork({ providerId, fileUuid })
      load()
    } catch {
      Alert.alert(t('common.errorTitle'), t('account.uploadFailed'))
    } finally {
      setUploading(false)
    }
  }

  const remove = (id: number) => {
    if (!providerId) return
    Alert.alert(t('account.deleteConfirm'), '', [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.confirm'),
        style: 'destructive',
        onPress: async () => {
          try {
            await providerApi.deleteWork(id, providerId)
            setWorks(prev => prev.filter(w => w.id !== id))
          } catch {
            Alert.alert(t('common.errorTitle'), t('account.deleteFailed'))
          }
        },
      },
    ])
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader title={t('account.works')} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Button label={t('account.uploadWork')} onPress={upload} loading={uploading} />
        <View style={styles.grid}>
          {works.map(work => (
            <View key={work.id} style={styles.thumbWrap}>
              {work.imageUrl ? (
                <Image source={{ uri: work.imageUrl }} style={styles.thumb} />
              ) : (
                <View style={[styles.thumb, styles.thumbEmpty]} />
              )}
              <TouchableOpacity style={styles.deleteBtn} onPress={() => remove(work.id)}>
                <Ionicons name="close-circle" size={22} color={colors.danger} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
        {works.length === 0 ? <Text style={styles.empty}>{t('account.noWorks')}</Text> : null}
      </ScrollView>
    </SafeAreaView>
  )
}

const makeStyles = (colors: AppColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.lg, gap: spacing.md },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  thumbWrap: { width: '31%', aspectRatio: 1, position: 'relative' },
  thumb: { width: '100%', height: '100%', borderRadius: radius.md, backgroundColor: colors.border },
  thumbEmpty: { backgroundColor: colors.border },
  deleteBtn: { position: 'absolute', top: 4, right: 4 },
  empty: { textAlign: 'center', color: colors.textSecondary, marginTop: spacing.lg },
})
