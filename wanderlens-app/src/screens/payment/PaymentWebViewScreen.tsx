import React, { useEffect, useRef, useState } from 'react'
import { View, StyleSheet, ActivityIndicator, Platform } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { WebView } from 'react-native-webview'
import { spacing, useColors, type AppColors } from '@/theme'
import ScreenHeader from '@/components/ScreenHeader'
import StateView from '@/components/StateView'
import Button from '@/components/Button'
import Text from '@/components/Text'
import { useLocale } from '@/i18n'
import { orderApi, paymentApi } from '@/api'
import { haptics } from '@/utils/haptics'
import {
  isPaymentCompleteUrl,
  submitEcpayFormOnWeb,
} from '@/utils/ecpayPayment'

interface Props {
  route: {
    params?: {
      paymentForm?: string
      orderId?: number
      orderNo?: string
      amount?: number
      title?: string
      successRoute?: string
    }
  }
  navigation: any
}

// 付款成功 = 訂單狀態已脫離未付款階段
const UNPAID_STATUSES = ['Draft', 'PendingPayment', 'Cancelled', 'Refunded']

export default function PaymentWebViewScreen({ route, navigation }: Props) {
  const colors = useColors()
  const styles = React.useMemo(() => makeStyles(colors), [colors])
  const { t } = useLocale()
  const {
    paymentForm, orderId, orderNo: orderNoParam, amount, title = t('payment.title'), successRoute = 'OrderDetail',
  } = route.params || {}

  const [webSubmitted, setWebSubmitted] = useState(false)
  const [webSubmitFailed, setWebSubmitFailed] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [verifyError, setVerifyError] = useState('')
  const handledRef = useRef(false)

  const navigateToOrder = () => {
    if (handledRef.current || !orderId) return
    handledRef.current = true
    navigation.navigate('MainTabs', {
      screen: 'Profile',
      params: {
        screen: successRoute === 'OrderDetail' ? 'OrderDetail' : successRoute,
        params: { orderId },
      },
    })
  }

  // 解析訂單編號（checkPayment 需要 orderNo）
  const resolveOrderNo = async (): Promise<string | null> => {
    if (orderNoParam) return orderNoParam
    if (!orderId) return null
    try {
      const res: any = await orderApi.getOrder(orderId)
      return res.data?.orderNo ?? null
    } catch {
      return null
    }
  }

  // 向伺服器確認付款結果，確認成功才導向訂單
  const verifyAndProceed = async () => {
    if (handledRef.current || verifying) return
    if (!orderId) {
      navigateToOrder()
      return
    }
    setVerifying(true)
    setVerifyError('')
    try {
      const orderNo = await resolveOrderNo()
      if (!orderNo) {
        setVerifyError(t('payment.notConfirmed'))
        return
      }
      // 綠界回呼為 server-to-server，可能稍有延遲，輪詢數次
      for (let attempt = 0; attempt < 5; attempt++) {
        try {
          const res: any = await paymentApi.checkPayment(orderNo)
          const status: string = res.data ?? ''
          if (status && !UNPAID_STATUSES.includes(status)) {
            haptics.success()
            navigateToOrder()
            return
          }
        } catch {
          // 單次查詢失敗不中斷，續嘗試
        }
        await new Promise((r) => setTimeout(r, 1500))
      }
      haptics.warning()
      setVerifyError(t('payment.notConfirmed'))
    } finally {
      setVerifying(false)
    }
  }

  useEffect(() => {
    if (Platform.OS !== 'web' || !paymentForm) return
    const ok = submitEcpayFormOnWeb(paymentForm)
    setWebSubmitted(ok)
    setWebSubmitFailed(!ok)
  }, [paymentForm])

  if (!paymentForm) {
    return (
      <SafeAreaView style={styles.container}>
        <ScreenHeader title={title} onBack={() => navigation.goBack()} />
        <StateView type="error" message={t('payment.noForm')} onRetry={() => navigation.goBack()} />
      </SafeAreaView>
    )
  }

  if (Platform.OS === 'web') {
    return (
      <SafeAreaView style={styles.container}>
        <ScreenHeader
          title={title}
          subtitle={amount != null ? `NT$ ${amount.toLocaleString()}` : undefined}
          onBack={() => navigation.goBack()}
        />
        <View style={styles.webPanel}>
          {webSubmitFailed ? (
            <StateView type="error" message={t('payment.webSubmitFailed')} onRetry={() => {
              setWebSubmitFailed(!submitEcpayFormOnWeb(paymentForm))
            }} />
          ) : (
            <>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text variant="title" align="center" style={styles.webHint}>
                {verifying ? t('payment.verifying') : (webSubmitted ? t('payment.redirecting') : t('common.loading'))}
              </Text>
              <Text variant="bodySmall" muted align="center" style={styles.webSubHint}>{t('payment.webCompleteHint')}</Text>
              {verifyError ? (
                <Text variant="bodySmall" color="danger" align="center" style={styles.webSubHint}>{verifyError}</Text>
              ) : null}
              <Button
                label={t('payment.completed')}
                onPress={verifyAndProceed}
                loading={verifying}
                fullWidth
                size="lg"
                style={styles.actionBtn}
              />
              <Button
                label={t('payment.backToOrders')}
                onPress={() => navigation.navigate('OrderList')}
                variant="outline"
                fullWidth
                style={styles.actionBtn}
              />
            </>
          )}
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScreenHeader
        title={title}
        subtitle={amount != null ? `NT$ ${amount.toLocaleString()}` : undefined}
        onBack={() => navigation.goBack()}
      />
      <WebView
        originWhitelist={['https://*', 'http://*']}
        source={{ html: paymentForm, baseUrl: 'https://payment-stage.ecpay.com.tw' }}
        startInLoadingState
        renderLoading={() => (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text variant="bodySmall" muted>{t('payment.redirecting')}</Text>
          </View>
        )}
        onNavigationStateChange={(nav) => {
          if (isPaymentCompleteUrl(nav.url || '')) {
            verifyAndProceed()
          }
        }}
        onShouldStartLoadWithRequest={(req) => {
          const url = req.url || ''
          if (isPaymentCompleteUrl(url)) {
            verifyAndProceed()
            return false
          }
          return true
        }}
      />
      <View style={styles.footer}>
        {verifyError ? (
          <Text variant="bodySmall" color="danger" align="center" style={styles.footerError}>{verifyError}</Text>
        ) : null}
        <Button
          label={verifying ? t('payment.verifying') : t('payment.completed')}
          onPress={verifyAndProceed}
          loading={verifying}
          fullWidth
        />
      </View>
    </SafeAreaView>
  )
}

const makeStyles = (colors: AppColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: spacing.sm },
  webPanel: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    padding: spacing.xl,
  },
  webHint: { marginTop: spacing.md },
  webSubHint: { marginTop: spacing.sm, lineHeight: 20 },
  actionBtn: { marginTop: spacing.md },
  footer: {
    padding: spacing.md, backgroundColor: colors.surface,
    borderTopWidth: 1, borderTopColor: colors.border,
  },
  footerError: { marginBottom: spacing.sm },
})
