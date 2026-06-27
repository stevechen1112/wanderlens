import React, { useState } from 'react'
import {
  View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { authApi } from '@/api'
import { useAuthStore } from '@/stores/authStore'
import Button from '@/components/Button'
import { lightColors, type AppColors } from '@/theme'
import { radius, spacing } from '@/theme/spacing'

export default function LoginScreen() {
  // 品牌登入頁採固定橘底白卡，刻意不隨深色模式變化以維持品牌識別與可讀性
  const colors = lightColors
  const styles = React.useMemo(() => makeStyles(colors), [colors])
  const [empno, setEmpno] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const { setAuth } = useAuthStore()

  const handleLogin = async () => {
    if (!empno.trim() || !password.trim()) {
      setError('請輸入員工編號與密碼')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res: { data?: { token: string; userId: number; providerId?: number | null; username: string; role: string; avatar?: string }; message?: string } =
        await authApi.login(empno.trim(), password)
      if (res.data?.token) {
        const { token } = res.data
        // 先用 login 回應的資料 setAuth（讓用戶立刻進入 App）
        await setAuth(token, {
          userId: res.data.userId,
          providerId: res.data.providerId,
          empno: empno.trim(),
          username: res.data.username,
          role: res.data.role,
          avatar: res.data.avatar ?? '',
        })
        // 背景刷新 me() 更新最新資訊（不重複 setAuth，由 refreshMe 處理）
        try {
          const { useAuthStore } = await import('@/stores/authStore')
          await useAuthStore.getState().refreshMe()
        } catch {
          // me() 失敗不阻斷登入流程
        }
      } else {
        setError(res.message || '登入失敗，請確認帳號密碼')
      }
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(msg || '網路錯誤，請稍後再試')
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.hero}>
          <View style={styles.logoCircle}>
            <Ionicons name="camera" size={40} color={colors.white} />
          </View>
          <Text style={styles.brand}>WanderLens</Text>
          <Text style={styles.tagline}>攝影師工作台</Text>
          <Text style={styles.desc}>外出拍攝時的隨身履約工具</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>登入帳號</Text>

          <View style={styles.inputWrap}>
            <Ionicons name="person-outline" size={20} color={colors.textSecondary} />
            <TextInput
              style={styles.input}
              placeholder="員工編號"
              placeholderTextColor={colors.textSecondary}
              value={empno}
              onChangeText={setEmpno}
              autoCapitalize="none"
              editable={!loading}
            />
          </View>

          <View style={styles.inputWrap}>
            <Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} />
            <TextInput
              style={styles.input}
              placeholder="密碼"
              placeholderTextColor={colors.textSecondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              editable={!loading}
            />
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={colors.textSecondary}
              onPress={() => setShowPassword(!showPassword)}
            />
          </View>

          {error ? (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={16} color={colors.danger} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <Button label="登入" onPress={handleLogin} loading={loading} style={styles.loginBtn} />
        </View>

        <Text style={styles.footer}>© WanderLens Provider v0.1.0</Text>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const makeStyles = (colors: AppColors) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.primary },
  container: { flex: 1, justifyContent: 'center', paddingHorizontal: spacing.xxl },
  hero: { alignItems: 'center', marginBottom: spacing.xxxl },
  logoCircle: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center', alignItems: 'center', marginBottom: spacing.lg,
  },
  brand: { fontSize: 32, fontWeight: '800', color: colors.white },
  tagline: { fontSize: 18, fontWeight: '600', color: 'rgba(255,255,255,0.95)', marginTop: 4 },
  desc: { fontSize: 14, color: 'rgba(255,255,255,0.75)', marginTop: 8 },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.xxl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  cardTitle: { fontSize: 20, fontWeight: '700', color: colors.textPrimary, marginBottom: spacing.xl },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    borderWidth: 1, borderColor: colors.border, borderRadius: radius.md,
    paddingHorizontal: spacing.lg, marginBottom: spacing.md, backgroundColor: colors.background,
  },
  input: { flex: 1, fontSize: 16, paddingVertical: spacing.md, color: colors.textPrimary },
  errorBox: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: colors.danger + '12', padding: spacing.md, borderRadius: radius.sm, marginBottom: spacing.md,
  },
  errorText: { flex: 1, color: colors.danger, fontSize: 14 },
  loginBtn: { marginTop: spacing.sm },
  footer: { textAlign: 'center', color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: spacing.xxxl },
})
