import { Platform } from 'react-native'
import * as Haptics from 'expo-haptics'

// 觸覺回饋封裝：Web 自動降級為 no-op，且永不因錯誤中斷流程
const enabled = Platform.OS === 'ios' || Platform.OS === 'android'

export const haptics = {
  light: () => {
    if (enabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {})
  },
  medium: () => {
    if (enabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {})
  },
  heavy: () => {
    if (enabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {})
  },
  success: () => {
    if (enabled) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {})
  },
  warning: () => {
    if (enabled) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {})
  },
  error: () => {
    if (enabled) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {})
  },
  selection: () => {
    if (enabled) Haptics.selectionAsync().catch(() => {})
  },
}
